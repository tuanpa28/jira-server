import { IsEmail, IsNotEmpty, Length, Min } from 'class-validator';
import { Column as ColumnORM, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '~/shared/constants';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ColumnORM({ default: '' })
  googleId: string;

  @ColumnORM({ unique: true })
  @IsNotEmpty()
  @Length(4, 20)
  username: string;

  @ColumnORM({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ColumnORM()
  @IsNotEmpty()
  @Min(6)
  password: string;

  @ColumnORM({ default: '' })
  avatar?: string;

  @ColumnORM({ default: Role.User })
  role?: string;
}
