import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateCommentDto, UpdateCommentDto } from './dtos';
import { Comment } from './entities';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async findOne(id: string): Promise<Comment> {
    return await this.commentRepository.findOne({ where: { id } });
  }

  async findOneOptions({
    field,
    payload,
  }: {
    field: string;
    payload: any;
  }): Promise<Comment> {
    const query = {
      [field]: payload,
    };
    return await this.commentRepository.findOne(query);
  }

  async findAll(): Promise<Comment[]> {
    return await this.commentRepository.find();
  }

  async create(createDataDto: CreateCommentDto): Promise<Comment> {
    const comment = Object.assign(new Comment(), createDataDto);
    return await this.commentRepository.save(comment);
  }

  async update(id: string, updateDataDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.commentRepository.update({ id }, updateDataDto);
    return comment;
  }

  async remove(id: string): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
