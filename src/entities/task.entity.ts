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
import { Column } from './column.entity';
import { Comment } from './comment.entity';
import { Project } from './project.entity';
import { User } from './users.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ColumnORM({ nullable: true })
  title: string;

  @ColumnORM({ nullable: true })
  description?: string;

  @ColumnORM()
  projectId: number;

  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'users_assign',
    joinColumn: {
      name: 'taskId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'userAssignTaskId',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'userAssignUserId',
    },
  })
  usersAssign: User[];

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
  comments: Comment[];

  @ColumnORM()
  columnId: number;

  @ManyToOne(() => Column, (column) => column.tasks)
  @JoinColumn({ name: 'columnId' })
  column: Column;
}
