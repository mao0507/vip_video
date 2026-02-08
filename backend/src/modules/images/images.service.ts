import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../../entities';
import { CreateImageDto, UpdateImageDto, QueryImageDto } from './dto';
import { VIP_LEVELS, VIP_LEVEL_NAMES } from '../../common/constants';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async findAll(query: QueryImageDto, userVipLevel: number) {
    if (userVipLevel < VIP_LEVELS.PLATINUM) {
      throw new ForbiddenException(
        `圖片功能需要 ${VIP_LEVEL_NAMES[VIP_LEVELS.PLATINUM]} 以上等級才能使用`,
      );
    }

    const { page = 1, limit = 10, keyword } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.imageRepository
      .createQueryBuilder('image')
      .where('image.isActive = :isActive', { isActive: true })
      .andWhere('image.requiredVipLevel <= :userVipLevel', { userVipLevel });

    if (keyword) {
      queryBuilder.andWhere(
        '(image.title LIKE :keyword OR image.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    const [images, total] = await queryBuilder
      .orderBy('image.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      items: images.map((image) => this.formatImageResponse(image)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userVipLevel: number) {
    if (userVipLevel < VIP_LEVELS.PLATINUM) {
      throw new ForbiddenException(
        `圖片功能需要 ${VIP_LEVEL_NAMES[VIP_LEVELS.PLATINUM]} 以上等級才能使用`,
      );
    }

    const image = await this.imageRepository.findOne({
      where: { id, isActive: true },
    });

    if (!image) {
      throw new NotFoundException('圖片不存在');
    }

    if (userVipLevel < image.requiredVipLevel) {
      throw new ForbiddenException(
        `此圖片需要 ${VIP_LEVEL_NAMES[image.requiredVipLevel]} 以上等級才能觀看`,
      );
    }

    return this.formatImageResponse(image);
  }

  async findAllForAdmin(query: QueryImageDto) {
    const { page = 1, limit = 10, keyword } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.imageRepository.createQueryBuilder('image');

    if (keyword) {
      queryBuilder.andWhere(
        '(image.title LIKE :keyword OR image.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    const [images, total] = await queryBuilder
      .orderBy('image.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      items: images,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneForAdmin(id: string) {
    const image = await this.imageRepository.findOne({ where: { id } });

    if (!image) {
      throw new NotFoundException('圖片不存在');
    }

    return image;
  }

  async create(createImageDto: CreateImageDto) {
    const image = this.imageRepository.create({
      ...createImageDto,
      requiredVipLevel: createImageDto.requiredVipLevel || VIP_LEVELS.PLATINUM,
    });
    return this.imageRepository.save(image);
  }

  async update(id: string, updateImageDto: UpdateImageDto) {
    const image = await this.imageRepository.findOne({ where: { id } });

    if (!image) {
      throw new NotFoundException('圖片不存在');
    }

    Object.assign(image, updateImageDto);
    return this.imageRepository.save(image);
  }

  async remove(id: string) {
    const image = await this.imageRepository.findOne({ where: { id } });

    if (!image) {
      throw new NotFoundException('圖片不存在');
    }

    await this.imageRepository.remove(image);
    return { message: '圖片已刪除' };
  }

  private formatImageResponse(image: Image) {
    return {
      ...image,
      requiredLevelName: VIP_LEVEL_NAMES[image.requiredVipLevel] || '未知等級',
    };
  }
}
