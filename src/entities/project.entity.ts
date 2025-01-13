import {
  Column as ColumnORM,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './categories.entity';
import { Column } from './column.entity';
import { Task } from './task.entity';
import { User } from './users.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @ColumnORM()
  name: string;

  @ColumnORM()
  url?: string;

  @ColumnORM()
  description?: string;

  @ColumnORM()
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.projects)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'project_member',
    joinColumn: {
      name: 'projectId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'projectUserProjectId',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'projectUserUserId',
    },
  })
  members: User[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @OneToMany(() => Column, (column) => column.project)
  columns: Column[];
}
