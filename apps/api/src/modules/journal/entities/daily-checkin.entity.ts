import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('daily_checkins')
@Unique(['userId', 'date'])
export class DailyCheckin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ name: 'energy_level', type: 'int' })
  energyLevel: number;

  @Column({ name: 'pain_level', type: 'int' })
  painLevel: number;

  @Column({ name: 'mood_level', type: 'int' })
  moodLevel: number;

  @Column({ name: 'cognitive_clarity', type: 'int' })
  cognitiveClarity: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
