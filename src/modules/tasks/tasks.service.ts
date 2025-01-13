import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IQueryOptions } from '~/common/dto';
import { Task, User } from '~/entities';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findOne(id: number): Promise<Task> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  async findOneOptions<T>({ field, payload }: { field: string; payload: T }): Promise<Task> {
    const query = {
      [field]: payload,
    };
    return await this.taskRepository.findOne(query);
  }

  async findAll(options: IQueryOptions): Promise<Task[]> {
    const { skip, limit, sort, order, ...params } = options;
    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    queryBuilder
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.usersAssign', 'user')
      .leftJoinAndSelect('task.column', 'column')
      .select([
        'task.id',
        'task.title',
        'task.description',
        'task.status',
        'task.originalEstimate',
        'task.timeTracking',
        'task.timeRemaining',
        'task.type',
        'task.priority',
        'project.id',
        'project.name',
        'project.url',
        'project.description',
        'user.id',
        'user.username',
        'user.email',
        'user.avatar',
        'user.role',
        'column.id',
        'column.name',
      ]);

    queryBuilder.where(params).skip(skip).take(limit).addOrderBy(`task.${sort}`, order);

    return await queryBuilder.getMany();
  }

  async create(createDataDto: CreateTaskDto): Promise<Task> {
    const newTask = this.taskRepository.create(createDataDto);
    const userAssignIds = createDataDto.userAssignIds;

    if (userAssignIds) {
      newTask.usersAssign = userAssignIds.map((id) => ({ ...new User(), id }));
    }

    return this.taskRepository.save(newTask);
  }

  async update(id: number, updateDataDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    const userAssignIds = updateDataDto.userAssignIds;

    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    Object.assign(task, updateDataDto);

    if (userAssignIds) {
      task.usersAssign = userAssignIds.map((id) => ({ ...new User(), id }));
    }

    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<any> {
    return await this.taskRepository.delete(id);
  }

  async count(query = {}): Promise<number> {
    return await this.taskRepository.count({ where: query });
  }
}
