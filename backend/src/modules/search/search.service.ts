import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video, Image } from '../../entities';
import { SearchDto, SearchType } from './dto';
import { VIP_LEVELS, VIP_LEVEL_NAMES } from '../../common/constants';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async search(searchDto: SearchDto, userVipLevel?: number) {
    const { keyword, type = SearchType.ALL, page = 1, limit = 10 } = searchDto;

    if (!keyword || keyword.trim() === '') {
      return {
        videos: { items: [], total: 0 },
        images: { items: [], total: 0 },
      };
    }

    const results: {
      videos?: { items: any[]; total: number };
      images?: { items: any[]; total: number };
    } = {};

    if (type === SearchType.ALL || type === SearchType.VIDEOS) {
      results.videos = await this.searchVideos(keyword, page, limit, userVipLevel);
    }

    if (type === SearchType.ALL || type === SearchType.IMAGES) {
      results.images = await this.searchImages(keyword, page, limit, userVipLevel);
    }

    return results;
  }

  private async searchVideos(
    keyword: string,
    page: number,
    limit: number,
    userVipLevel?: number,
  ) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.category', 'category')
      .leftJoinAndSelect('video.tags', 'tags')
      .where('video.isActive = :isActive', { isActive: true })
      .andWhere(
        '(video.title ILIKE :keyword OR video.description ILIKE :keyword)',
        { keyword: `%${keyword}%` },
      );

    const [videos, total] = await queryBuilder
      .orderBy('video.viewCount', 'DESC')
      .addOrderBy('video.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const items = videos.map((video) => {
      const canWatch = userVipLevel ? userVipLevel >= video.requiredVipLevel : false;
      return {
        ...video,
        canWatch,
        isPreviewOnly: !canWatch,
        requiredLevelName: VIP_LEVEL_NAMES[video.requiredVipLevel] || '未知等級',
        effectiveDuration: canWatch ? video.duration : video.previewDuration,
      };
    });

    return { items, total };
  }

  private async searchImages(
    keyword: string,
    page: number,
    limit: number,
    userVipLevel?: number,
  ) {
    if (!userVipLevel || userVipLevel < VIP_LEVELS.PLATINUM) {
      return {
        items: [],
        total: 0,
        message: `圖片搜尋需要 ${VIP_LEVEL_NAMES[VIP_LEVELS.PLATINUM]} 以上等級`,
      };
    }

    const skip = (page - 1) * limit;

    const queryBuilder = this.imageRepository
      .createQueryBuilder('image')
      .where('image.isActive = :isActive', { isActive: true })
      .andWhere('image.requiredVipLevel <= :userVipLevel', { userVipLevel })
      .andWhere(
        '(image.title ILIKE :keyword OR image.description ILIKE :keyword)',
        { keyword: `%${keyword}%` },
      );

    const [images, total] = await queryBuilder
      .orderBy('image.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const items = images.map((image) => ({
      ...image,
      requiredLevelName: VIP_LEVEL_NAMES[image.requiredVipLevel] || '未知等級',
    }));

    return { items, total };
  }

  async getSuggestions(keyword: string, limit: number = 5) {
    if (!keyword || keyword.trim() === '') {
      return [];
    }

    const videos = await this.videoRepository
      .createQueryBuilder('video')
      .select('video.title')
      .where('video.isActive = :isActive', { isActive: true })
      .andWhere('video.title ILIKE :keyword', { keyword: `%${keyword}%` })
      .orderBy('video.viewCount', 'DESC')
      .limit(limit)
      .getMany();

    return videos.map((v) => v.title);
  }
}
