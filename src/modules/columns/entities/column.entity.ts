import {
  Column as ColumnORM,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Project } from '~/modules/projects/entities';
import { Task } from '~/modules/tasks/entities';

@Entity('columns')
export class Column {
  @PrimaryGeneratedColumn()
  id: number;

  @ColumnORM({ unique: true })
  name: string;

  @ManyToOne(() => Project, (project) => project.columns)
  project: Project;

  @OneToMany(() => Task, (task) => task.column)
  tasks?: Task;
}
