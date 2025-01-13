import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IQueryOptions } from '~/common/dto';
import { User } from '~/entities';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findOneOptions<T>({ field, payload }: { field: string; payload: T }): Promise<User> {
    const query = {
      [field]: payload,
    };

    return await this.userRepository.findOne(query);
  }

  async findAll(options: IQueryOptions): Promise<User[]> {
    const { skip, limit, sort, order, ...params } = options;

    return await this.userRepository.find({
      where: params,
      skip: skip,
      take: limit,
      order: { [sort]: order },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<any> {
    return await this.userRepository.delete(id);
  }

  async count(query = {}): Promise<number> {
    return await this.userRepository.count({ where: query });
  }
}
