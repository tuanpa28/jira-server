import { Task } from '@/tasks/entities';
import { User } from '@/users/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  content: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Task, (task) => task.comments)
  task: Task;
}
