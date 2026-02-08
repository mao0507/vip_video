import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Video, Tag, Category } from '../../entities';
import { CreateVideoDto, UpdateVideoDto, QueryVideoDto } from './dto';
import { VIP_LEVEL_NAMES } from '../../common/constants';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(query: QueryVideoDto, userVipLevel?: number) {
    const { page = 1, limit = 10, categoryId, tagId, keyword, maxVipLevel } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.category', 'category')
      .leftJoinAndSelect('video.tags', 'tags')
      .where('video.isActive = :isActive', { isActive: true });

    if (categoryId) {
      queryBuilder.andWhere('video.categoryId = :categoryId', { categoryId });
    }

    if (tagId) {
      queryBuilder.andWhere('tags.id = :tagId', { tagId });
    }

    if (keyword) {
      queryBuilder.andWhere(
        '(video.title LIKE :keyword OR video.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (maxVipLevel) {
      queryBuilder.andWhere('video.requiredVipLevel <= :maxVipLevel', {
        maxVipLevel,
      });
    }

    const [videos, total] = await queryBuilder
      .orderBy('video.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const items = videos.map((video) =>
      this.formatVideoResponse(video, userVipLevel),
    );

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userVipLevel?: number) {
    const video = await this.videoRepository.findOne({
      where: { id, isActive: true },
      relations: ['category', 'tags'],
    });

    if (!video) {
      throw new NotFoundException('影片不存在');
    }

    return this.formatVideoResponse(video, userVipLevel);
  }

  async findOneForAdmin(id: string) {
    const video = await this.videoRepository.findOne({
      where: { id },
      relations: ['category', 'tags'],
    });

    if (!video) {
      throw new NotFoundException('影片不存在');
    }

    return video;
  }

  async findAllForAdmin(query: QueryVideoDto) {
    const { page = 1, limit = 10, categoryId, keyword } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.category', 'category')
      .leftJoinAndSelect('video.tags', 'tags');

    if (categoryId) {
      queryBuilder.andWhere('video.categoryId = :categoryId', { categoryId });
    }

    if (keyword) {
      queryBuilder.andWhere(
        '(video.title LIKE :keyword OR video.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    const [videos, total] = await queryBuilder
      .orderBy('video.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      items: videos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(createVideoDto: CreateVideoDto) {
    const { tagIds, categoryId, ...videoData } = createVideoDto;

    const video = this.videoRepository.create(videoData);

    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException('分類不存在');
      }
      video.categoryId = categoryId;
    }

    if (tagIds && tagIds.length > 0) {
      const tags = await this.tagRepository.find({
        where: { id: In(tagIds) },
      });
      video.tags = tags;
    }

    return this.videoRepository.save(video);
  }

  async update(id: string, updateVideoDto: UpdateVideoDto) {
    const video = await this.videoRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!video) {
      throw new NotFoundException('影片不存在');
    }

    const { tagIds, categoryId, ...videoData } = updateVideoDto;

    if (categoryId !== undefined) {
      if (categoryId) {
        const category = await this.categoryRepository.findOne({
          where: { id: categoryId },
        });
        if (!category) {
          throw new NotFoundException('分類不存在');
        }
      }
      video.categoryId = categoryId || null;
    }

    if (tagIds !== undefined) {
      if (tagIds.length > 0) {
        const tags = await this.tagRepository.find({
          where: { id: In(tagIds) },
        });
        video.tags = tags;
      } else {
        video.tags = [];
      }
    }

    Object.assign(video, videoData);
    return this.videoRepository.save(video);
  }

  async remove(id: string) {
    const video = await this.videoRepository.findOne({ where: { id } });

    if (!video) {
      throw new NotFoundException('影片不存在');
    }

    await this.videoRepository.remove(video);
    return { message: '影片已刪除' };
  }

  async incrementViewCount(id: string) {
    await this.videoRepository.increment({ id }, 'viewCount', 1);
  }

  private formatVideoResponse(video: Video, userVipLevel?: number) {
    const canWatch = userVipLevel ? userVipLevel >= video.requiredVipLevel : false;
    const isPreviewOnly = !canWatch;

    return {
      ...video,
      canWatch,
      isPreviewOnly,
      requiredLevelName: VIP_LEVEL_NAMES[video.requiredVipLevel] || '未知等級',
      effectiveDuration: isPreviewOnly ? video.previewDuration : video.duration,
    };
  }
}
