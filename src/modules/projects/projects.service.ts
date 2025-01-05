import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProjectDto, UpdateProjectDto } from './dtos';
import { Project } from './entities';
import { CommonQueryOptions } from '~/common/dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findOne(id: number): Promise<Project> {
    return await this.projectRepository.findOne({ where: { id } });
  }

  async findOneOptions({
    field,
    payload,
  }: {
    field: string;
    payload: any;
  }): Promise<Project> {
    const query = {
      [field]: payload,
    };
    return await this.projectRepository.findOne(query);
  }

  async findAll(options: CommonQueryOptions): Promise<Project[]> {
    const { skip, limit, sort, ...params } = options;

    return await this.projectRepository.find({
      where: params,
      skip: skip,
      take: limit,
      order: sort,
    });
  }

  async create(createDataDto: CreateProjectDto): Promise<Project> {
    const newProject = this.projectRepository.create(createDataDto);
    return this.projectRepository.save(newProject);
  }

  async update(id: number, updateDataDto: UpdateProjectDto): Promise<Project> {
    await this.projectRepository.update(id, updateDataDto);
    return this.projectRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<any> {
    return await this.projectRepository.delete(id);
  }

  async count(query = {}): Promise<number> {
    return await this.projectRepository.count({ where: query });
  }
}
