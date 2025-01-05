import {
  Column as ColumnORM,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Column } from '~/modules/columns/entities';
import { Comment } from '~/modules/comments/entities';
import { Project } from '~/modules/projects/entities';
import { User } from '~/modules/users/entities';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ColumnORM({ nullable: true })
  title: string;

  @ColumnORM({ nullable: true })
  description?: string;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @ManyToMany(() => User)
  @JoinTable({ name: 'users_assign' })
  usersAssign?: User[];

  @ColumnORM({ default: 'TO DO', enum: ['TO DO', 'IN PROGRESS', 'DONE'] })
  status?: string;

  @ColumnORM({ default: 0 })
  originalEstimate?: number;

  @ColumnORM({ default: 0 })
  timeTracking?: number;

  @ColumnORM({ default: 0 })
  timeRemaining?: number;

  @ColumnORM({
    default: 'Task',
    enum: ['Task', 'Bug', 'Story'],
  })
  type?: string;

  @ColumnORM({
    default: 'Medium',
    enum: ['Highest', 'Hight', 'Medium', 'Lowest', 'Low'],
  })
  priority?: string;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments?: Comment[];

  @ManyToOne(() => Column, (column) => column.tasks)
  column: Column;
}
