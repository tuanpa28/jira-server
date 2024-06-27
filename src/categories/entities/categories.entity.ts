import { Project } from '@/projects/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Project, (project) => project.category)
  projects?: Project[];
}
