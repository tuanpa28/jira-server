import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateColumnDto, UpdateColumnDto } from './dtos';
import { Column } from './entities';
import { CommonQueryOptions } from '~/common/dto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(Column)
    private columnRepository: Repository<Column>,
  ) {}

  async findOne(id: number): Promise<Column> {
    return await this.columnRepository.findOne({ where: { id } });
  }

  async findOneOptions({
    field,
    payload,
  }: {
    field: string;
    payload: any;
  }): Promise<Column> {
    const query = {
      [field]: payload,
    };
    return await this.columnRepository.findOne(query);
  }

  async findAll(options: CommonQueryOptions): Promise<Column[]> {
    const { skip, limit, sort, ...params } = options;

    return await this.columnRepository.find({
      where: params,
      skip: skip,
      take: limit,
      order: sort,
    });
  }

  async create(createColumnDto: CreateColumnDto): Promise<Column> {
    const newColumn = this.columnRepository.create(createColumnDto);
    return this.columnRepository.save(newColumn);
  }

  async update(id: number, updateColumnDto: UpdateColumnDto): Promise<Column> {
    await this.columnRepository.update(id, updateColumnDto);
    return this.columnRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<any> {
    return await this.columnRepository.delete(id);
  }

  async count(query = {}): Promise<number> {
    return await this.columnRepository.count({ where: query });
  }
}
