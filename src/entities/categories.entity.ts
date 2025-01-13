import { Column as ColumnORM, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @ColumnORM()
  name: string;

  @OneToMany(() => Project, (project) => project.category)
  projects: Project[];
}
