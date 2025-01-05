import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskDto, UpdateTaskDto } from './dtos';
import { Task } from './entities';
import { CommonQueryOptions } from '~/common/dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findOne(id: number): Promise<Task> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  async findOneOptions({
    field,
    payload,
  }: {
    field: string;
    payload: any;
  }): Promise<Task> {
    const query = {
      [field]: payload,
    };
    return await this.taskRepository.findOne(query);
  }

  async findAll(options: CommonQueryOptions): Promise<Task[]> {
    const { skip, limit, sort, ...params } = options;

    return await this.taskRepository.find({
      where: params,
      skip: skip,
      take: limit,
      order: sort,
    });
  }

  async create(createDataDto: CreateTaskDto): Promise<Task> {
    const newTask = this.taskRepository.create(createDataDto);
    return this.taskRepository.save(newTask);
  }

  async update(id: number, updateDataDto: UpdateTaskDto): Promise<Task> {
    await this.taskRepository.update(id, updateDataDto);
    return this.taskRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<any> {
    return await this.taskRepository.delete(id);
  }

  async count(query = {}): Promise<number> {
    return await this.taskRepository.count({ where: query });
  }
}
