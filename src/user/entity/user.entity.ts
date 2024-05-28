import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../enums/role.enum';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 127 })
  name: string;

  @Column({
    type: 'varchar',
    length: 127,
    unique: true,
  })
  email: string;

  @Column({ type: 'varchar', length: 64 })
  password: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  birthAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;

  @Column({
    default: Role.User,
  })
  role: number;
}
