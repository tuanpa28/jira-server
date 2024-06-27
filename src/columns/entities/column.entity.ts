import { Project } from '@/projects/entities';
import { Task } from '@/tasks/entities';
import {
  Column as ColumnORM,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('columns')
export class Column {
  @PrimaryGeneratedColumn()
  id: string;

  @ColumnORM({ unique: true })
  name: string;

  @ManyToOne(() => Project, (project) => project.columns)
  project: Project;

  @OneToMany(() => Task, (task) => task.column)
  tasks?: Task;
}
