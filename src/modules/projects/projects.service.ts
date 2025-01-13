import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IQueryOptions } from '~/common/dto';
import { Project, User } from '~/entities';
import { CreateProjectDto, UpdateProjectDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findOne(id: number): Promise<Project> {
    return await this.projectRepository.findOne({ where: { id } });
  }

  async findOneOptions<T>({ field, payload }: { field: string; payload: T }): Promise<Project> {
    const query = {
      [field]: payload,
    };
    return await this.projectRepository.findOne(query);
  }

  async findAll(options: IQueryOptions): Promise<Project[]> {
    const { skip, limit, sort, order, ...params } = options;
    const queryBuilder = this.projectRepository.createQueryBuilder('project');

    queryBuilder
      .leftJoinAndSelect('project.category', 'category')
      .leftJoinAndSelect('project.members', 'user')
      .select([
        'project.id',
        'project.name',
        'project.url',
        'project.description',
        'category.id',
        'category.name',
        'user.id',
        'user.username',
        'user.email',
        'user.avatar',
        'user.role',
      ]);

    queryBuilder.where(params).skip(skip).take(limit).addOrderBy(`project.${sort}`, order);

    return await queryBuilder.getMany();
  }

  async create(createDataDto: CreateProjectDto): Promise<Project> {
    const newProject = this.projectRepository.create(createDataDto);
    const memberIds = createDataDto.memberIds;

    if (memberIds) {
      newProject.members = memberIds.map((id) => ({ ...new User(), id }));
    }

    return this.projectRepository.save(newProject);
  }

  async update(id: number, updateDataDto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    const memberIds = updateDataDto.memberIds;

    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }

    Object.assign(project, updateDataDto);

    if (memberIds) {
      project.members = memberIds.map((id) => ({ ...new User(), id }));
    }

    return this.projectRepository.save(project);
  }

  async remove(id: number): Promise<any> {
    return await this.projectRepository.delete(id);
  }

  async count(query = {}): Promise<number> {
    return await this.projectRepository.count({ where: query });
  }
}
