import {
  Column as ColumnORM,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Task } from './task.entity';

@Entity('columns')
export class Column {
  @PrimaryGeneratedColumn()
  id: number;

  @ColumnORM()
  name: string;

  @ColumnORM()
  projectId: number;

  @ManyToOne(() => Project, (project) => project.columns)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @OneToMany(() => Task, (task) => task.column)
  tasks: Task[];
}
