import { IsEmail, IsNotEmpty, Length, Min } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  @Length(4, 20)
  username: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  @Min(6)
  password: string;

  @Column({ default: '' })
  avatar?: string;

  @Column({ default: 'user' })
  role?: string;
}
