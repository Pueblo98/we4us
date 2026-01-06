import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

export type UserType = 'patient' | 'caregiver';
export type Archetype = 'information_seeker' | 'connection_seeker' | 'action_oriented' | 'newly_diagnosed';
export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash: string;

  @Column({ name: 'user_type', type: 'varchar', length: 20 })
  userType: UserType;

  // Personal info
  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ name: 'display_name', nullable: true })
  displayName: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  gender: Gender;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  // Journey info
  @Column({ type: 'varchar', length: 50, nullable: true })
  archetype: Archetype;

  @Column({ name: 'diagnosis_timeline', type: 'varchar', length: 30, nullable: true })
  diagnosisTimeline: string;

  // Onboarding status
  @Column({ name: 'onboarding_completed', default: false })
  onboardingCompleted: boolean;

  @Column({ name: 'onboarding_step', default: 0 })
  onboardingStep: number;

  // Privacy preferences
  @Column({ name: 'share_with_community', default: true })
  shareWithCommunity: boolean;

  @Column({ name: 'share_for_research', default: false })
  shareForResearch: boolean;

  // Status
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_memorial', default: false })
  isMemorial: boolean;

  @Column({ name: 'memorial_date', type: 'date', nullable: true })
  memorialDate: Date;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date;
}
