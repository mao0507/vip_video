import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../../entities';
import { CreateTagDto, UpdateTagDto } from './dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll() {
    return this.tagRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['videos'],
    });

    if (!tag) {
      throw new NotFoundException('標籤不存在');
    }

    return tag;
  }

  async findByName(name: string) {
    return this.tagRepository.findOne({ where: { name } });
  }

  async create(createTagDto: CreateTagDto) {
    const existingTag = await this.findByName(createTagDto.name);

    if (existingTag) {
      throw new ConflictException('標籤名稱已存在');
    }

    const tag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(tag);
  }

  async createMany(names: string[]) {
    const tags: Tag[] = [];

    for (const name of names) {
      let tag = await this.findByName(name);
      if (!tag) {
        tag = this.tagRepository.create({ name });
        tag = await this.tagRepository.save(tag);
      }
      tags.push(tag);
    }

    return tags;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.tagRepository.findOne({ where: { id } });

    if (!tag) {
      throw new NotFoundException('標籤不存在');
    }

    if (updateTagDto.name && updateTagDto.name !== tag.name) {
      const existingTag = await this.findByName(updateTagDto.name);
      if (existingTag) {
        throw new ConflictException('標籤名稱已存在');
      }
    }

    Object.assign(tag, updateTagDto);
    return this.tagRepository.save(tag);
  }

  async remove(id: string) {
    const tag = await this.tagRepository.findOne({ where: { id } });

    if (!tag) {
      throw new NotFoundException('標籤不存在');
    }

    await this.tagRepository.remove(tag);
    return { message: '標籤已刪除' };
  }

  async getPopularTags(limit: number = 10) {
    return this.tagRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.videos', 'video')
      .addSelect('COUNT(video.id)', 'videoCount')
      .groupBy('tag.id')
      .orderBy('videoCount', 'DESC')
      .limit(limit)
      .getRawAndEntities();
  }
}
