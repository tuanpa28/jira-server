import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '~/modules/tasks/entities';
import { User } from '~/modules/users/entities';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  content: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Task, (task) => task.comments)
  task: Task;
}
