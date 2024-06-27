import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto, UpdateProjectDto } from './dtos';
import { Project } from './entities';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findOne(id: string): Promise<Project> {
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

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find();
  }

  async create(createDataDto: CreateProjectDto): Promise<Project> {
    const project = Object.assign(new Project(), createDataDto);
    return await this.projectRepository.save(project);
  }

  async update(id: string, updateDataDto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    await this.projectRepository.update({ id }, updateDataDto);
    return project;
  }

  async remove(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
