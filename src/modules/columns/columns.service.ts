import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IQueryOptions } from '~/common/dto';
import { Column } from '~/entities';
import { CreateColumnDto, UpdateColumnDto } from './dto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(Column)
    private columnRepository: Repository<Column>,
  ) {}

  async findOne(id: number): Promise<Column> {
    return await this.columnRepository.findOne({ where: { id } });
  }

  async findOneOptions<T>({ field, payload }: { field: string; payload: T }): Promise<Column> {
    const query = {
      [field]: payload,
    };
    return await this.columnRepository.findOne(query);
  }

  async findAll(options: IQueryOptions): Promise<Column[]> {
    const { skip, limit, sort, order, ...params } = options;
    const queryBuilder = this.columnRepository.createQueryBuilder('column');

    queryBuilder
      .leftJoinAndSelect('column.tasks', 'task')
      .select([
        'column.id',
        'column.name',
        'task.id',
        'task.title',
        'task.description',
        'task.status',
        'task.originalEstimate',
        'task.timeTracking',
        'task.timeRemaining',
        'task.type',
        'task.priority',
      ]);

    queryBuilder.where(params).skip(skip).take(limit).addOrderBy(`column.${sort}`, order);

    return await queryBuilder.getMany();
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
