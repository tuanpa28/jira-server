import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';
import { CommonQueryOptions } from '~/common/dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findOne(id: number): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async findOneOptions({
    field,
    payload,
  }: {
    field: string;
    payload: unknown;
  }): Promise<Category> {
    const query = {
      [field]: payload,
    };
    return await this.categoryRepository.findOne(query);
  }

  async findAll(options: CommonQueryOptions): Promise<Category[]> {
    const { skip, limit, sort, ...params } = options;

    return await this.categoryRepository.find({
      where: params,
      skip: skip,
      take: limit,
      order: sort,
    });
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
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
