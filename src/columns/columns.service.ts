import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Column } from './entities';
import { CreateColumnDto, UpdateColumnDto } from './dtos';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(Column)
    private columnRepository: Repository<Column>,
  ) {}

  async findOne(id: string): Promise<Column> {
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

  async findAll(): Promise<Column[]> {
    return await this.columnRepository.find();
  }

  async create(createColumnDto: CreateColumnDto): Promise<Column> {
    const newColumn = this.columnRepository.create(createColumnDto);
    return await this.columnRepository.save(newColumn);
  }

  async update(id: string, updateColumnDto: UpdateColumnDto): Promise<Column> {
    const column = await this.columnRepository.findOne({ where: { id } });
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    await this.columnRepository.update({ id }, updateColumnDto);
    return column;
  }

  async remove(id: string): Promise<void> {
    await this.columnRepository.delete(id);
  }
}
