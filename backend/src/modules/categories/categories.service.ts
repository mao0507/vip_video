import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(includeInactive = false) {
    const whereCondition = includeInactive ? {} : { isActive: true };

    return this.categoryRepository.find({
      where: whereCondition,
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findAllWithVideoCount() {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.videos', 'video', 'video.isActive = :isActive', {
        isActive: true,
      })
      .addSelect('COUNT(video.id)', 'videoCount')
      .where('category.isActive = :categoryActive', { categoryActive: true })
      .groupBy('category.id')
      .orderBy('category.sortOrder', 'ASC')
      .addOrderBy('category.name', 'ASC')
      .getRawAndEntities();
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('分類不存在');
    }

    return category;
  }

  async findOneWithVideos(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id, isActive: true },
      relations: ['videos'],
    });

    if (!category) {
      throw new NotFoundException('分類不存在');
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('分類不存在');
    }

    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('分類不存在');
    }

    await this.categoryRepository.remove(category);
    return { message: '分類已刪除' };
  }

  async reorder(ids: string[]) {
    const updates = ids.map((id, index) =>
      this.categoryRepository.update(id, { sortOrder: index }),
    );
    await Promise.all(updates);
    return { message: '分類排序已更新' };
  }
}
