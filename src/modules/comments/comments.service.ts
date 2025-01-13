import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IQueryOptions } from '~/common/dto';
import { Comment } from '~/entities';
import { CreateCommentDto, UpdateCommentDto } from './dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async findOne(id: number): Promise<Comment> {
    return await this.commentRepository.findOne({ where: { id } });
  }

  async findOneOptions<T>({ field, payload }: { field: string; payload: T }): Promise<Comment> {
    const query = {
      [field]: payload,
    };
    return await this.commentRepository.findOne(query);
  }

  async findAll(options: IQueryOptions): Promise<Comment[]> {
    const { skip, limit, sort, order, ...params } = options;

    const queryBuilder = this.commentRepository.createQueryBuilder('comment');

    queryBuilder
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.task', 'task')
      .select([
        'comment.id',
        'comment.content',
        'user.id',
        'user.username',
        'user.email',
        'task.avatar',
        'task.title',
        'task.description',
        'task.status',
        'task.originalEstimate',
        'task.timeTracking',
        'task.timeRemaining',
        'task.type',
        'task.priority',
      ]);

    queryBuilder.where(params).skip(skip).take(limit).addOrderBy(`comment.${sort}`, order);

    return await queryBuilder.getMany();
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
