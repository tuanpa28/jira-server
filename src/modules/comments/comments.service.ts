import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCommentDto, UpdateCommentDto } from './dtos';
import { Comment } from './entities';
import { CommonQueryOptions } from '~/common/dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async findOne(id: number): Promise<Comment> {
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

  async findAll(options: CommonQueryOptions): Promise<Comment[]> {
    const { skip, limit, sort, ...params } = options;

    return await this.commentRepository.find({
      where: params,
      skip: skip,
      take: limit,
      order: sort,
    });
  }

  async create(createDataDto: CreateCommentDto): Promise<Comment> {
    const newComment = this.commentRepository.create(createDataDto);
    return this.commentRepository.save(newComment);
  }

  async update(id: number, updateDataDto: UpdateCommentDto): Promise<Comment> {
    await this.commentRepository.update(id, updateDataDto);
    return this.commentRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<any> {
    return await this.commentRepository.delete(id);
  }

  async count(query = {}): Promise<number> {
    return await this.commentRepository.count({ where: query });
  }
}
