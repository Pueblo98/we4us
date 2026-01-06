import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User, UserType, Archetype, Gender } from './entities/user.entity';
import { PatientProfile } from './entities/patient-profile.entity';

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  displayName?: string;
  age?: number;
  gender?: Gender;
  archetype?: Archetype;
  diagnosisTimeline?: string;
  shareWithCommunity?: boolean;
  shareForResearch?: boolean;
}

export interface CompleteOnboardingDto {
  firstName: string;
  lastName?: string;
  username: string;
  displayName?: string;
  age?: number;
  gender?: Gender;
  archetype: Archetype;
  diagnosisTimeline?: string;
  mgmtStatus?: string;
  treatmentPhase?: string;
  shareWithCommunity?: boolean;
  shareForResearch?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PatientProfile)
    private patientProfilesRepository: Repository<PatientProfile>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(data: {
    email: string;
    userType: UserType;
    passwordHash?: string;
  }): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async update(userId: string, data: UpdateUserDto): Promise<User> {
    // Check if username is being changed and if it's already taken
    if (data.username) {
      const existingUser = await this.usersRepository.findOne({
        where: { username: data.username, id: Not(userId) },
      });
      if (existingUser) {
        throw new ConflictException('Username is already taken');
      }
    }

    await this.usersRepository.update(userId, data);
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateOnboardingProgress(userId: string, step: number): Promise<void> {
    await this.usersRepository.update(userId, { onboardingStep: step });
  }

  async completeOnboarding(userId: string, data: CompleteOnboardingDto): Promise<User> {
    // Check username availability
    const existingUser = await this.usersRepository.findOne({
      where: { username: data.username, id: Not(userId) },
    });
    if (existingUser) {
      throw new ConflictException('Username is already taken');
    }

    // Update user profile
    await this.usersRepository.update(userId, {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      displayName: data.displayName || data.firstName,
      age: data.age,
      gender: data.gender,
      archetype: data.archetype,
      diagnosisTimeline: data.diagnosisTimeline,
      shareWithCommunity: data.shareWithCommunity ?? true,
      shareForResearch: data.shareForResearch ?? false,
      onboardingCompleted: true,
    });

    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create patient profile if user is a patient and has medical info
    if (user.userType === 'patient' && (data.mgmtStatus || data.treatmentPhase)) {
      const existingProfile = await this.getPatientProfile(userId);
      if (existingProfile) {
        await this.patientProfilesRepository.update(
          { userId },
          {
            mgmtStatus: data.mgmtStatus as any,
            currentTreatmentPhase: data.treatmentPhase as any,
          },
        );
      } else {
        await this.createPatientProfile(userId, {
          mgmtStatus: data.mgmtStatus as any,
          currentTreatmentPhase: data.treatmentPhase as any,
        });
      }
    }

    return user;
  }

  async createPatientProfile(userId: string, data: Partial<PatientProfile>): Promise<PatientProfile> {
    const profile = this.patientProfilesRepository.create({
      ...data,
      userId,
    });
    return this.patientProfilesRepository.save(profile);
  }

  async getPatientProfile(userId: string): Promise<PatientProfile | null> {
    return this.patientProfilesRepository.findOne({ where: { userId } });
  }

  async updatePatientProfile(userId: string, data: Partial<PatientProfile>): Promise<PatientProfile> {
    await this.patientProfilesRepository.update({ userId }, data);
    const profile = await this.getPatientProfile(userId);
    if (!profile) {
      throw new NotFoundException('Patient profile not found');
    }
    return profile;
  }

  async isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
    const query = excludeUserId
      ? { username, id: Not(excludeUserId) }
      : { username };
    const existingUser = await this.usersRepository.findOne({ where: query });
    return !existingUser;
  }
}
