import {
  Column as ColumnORM,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Category } from '@/categories/entities';
import { Column } from '@/columns/entities';
import { Task } from '@/tasks/entities';
import { User } from '@/users/entities';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: string;

  @ColumnORM({ unique: true })
  name: string;

  @ColumnORM()
  url?: string;

  @ColumnORM()
  description?: string;

  @ManyToOne(() => Category, (category) => category.projects)
  category?: Category;

  @ManyToMany(() => User)
  @JoinTable({ name: 'project_members' })
  members?: User[];

  @OneToMany(() => Task, (task) => task.project)
  tasks?: Task[];

  @OneToMany(() => Column, (column) => column.project)
  columns?: Column[];
}
