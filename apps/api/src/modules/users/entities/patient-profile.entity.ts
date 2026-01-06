import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export type DiagnosisTimeline = 'newly_diagnosed' | '1_month' | '3_months' | '6_months' | '1_year_plus';
export type MgmtStatus = 'methylated' | 'unmethylated' | 'unknown' | 'pending';
export type TreatmentPhase =
  | 'pre_treatment'
  | 'initial_surgery'
  | 'concurrent_chemoradiation'
  | 'adjuvant_chemotherapy'
  | 'maintenance'
  | 'recurrence'
  | 'clinical_trial'
  | 'palliative';

@Entity('patient_profiles')
export class PatientProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'diagnosis_date', type: 'date', nullable: true })
  diagnosisDate: Date;

  @Column({ name: 'time_since_diagnosis', type: 'varchar', length: 50, nullable: true })
  timeSinceDiagnosis: DiagnosisTimeline;

  @Column({ name: 'mgmt_status', type: 'varchar', length: 20, nullable: true })
  mgmtStatus: MgmtStatus;

  @Column({ name: 'idh_status', type: 'varchar', length: 20, nullable: true })
  idhStatus: string;

  @Column({ name: 'current_treatment_phase', type: 'varchar', length: 50, nullable: true })
  currentTreatmentPhase: TreatmentPhase;

  @Column({ name: 'karnofsky_score', nullable: true })
  karnofskyScore: number;

  @Column({ name: 'age_at_diagnosis', nullable: true })
  ageAtDiagnosis: number;

  @Column({ name: 'treating_institution', nullable: true })
  treatingInstitution: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
