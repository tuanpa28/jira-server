import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Project } from '~/modules/projects/entities';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Project, (project) => project.category)
  projects?: Project[];
}
