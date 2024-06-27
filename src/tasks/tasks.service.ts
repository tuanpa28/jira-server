import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto, UpdateTaskDto } from './dtos';
import { Task } from './entities';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findOne(id: string): Promise<Task> {
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

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async create(createDataDto: CreateTaskDto): Promise<Task> {
    const task = Object.assign(new Task(), createDataDto);
    return await this.taskRepository.save(task);
  }

  async update(id: string, updateDataDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.taskRepository.update({ id }, updateDataDto);
    return task;
  }

  async remove(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
