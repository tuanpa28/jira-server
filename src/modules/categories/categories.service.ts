import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IQueryOptions } from '~/common/dto';
import { Category } from '~/entities';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findOne(id: number): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async findOneOptions<T>({ field, payload }: { field: string; payload: T }): Promise<Category> {
    const query = {
      [field]: payload,
    };
    return await this.categoryRepository.findOne(query);
  }

  async findAll(options: IQueryOptions): Promise<Category[]> {
    const { skip, limit, sort, order, ...params } = options;
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    queryBuilder
      .leftJoinAndSelect('category.projects', 'project')
      .select([
        'category.id',
        'category.name',
        'project.id',
        'project.name',
        'project.url',
        'project.description',
      ]);

    queryBuilder.where(params).skip(skip).take(limit).addOrderBy(`category.${sort}`, order);

    return await queryBuilder.getMany();
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.categoryRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<any> {
    return await this.categoryRepository.delete(id);
  }

  async count(query = {}): Promise<number> {
    return await this.categoryRepository.count({ where: query });
  }
}
