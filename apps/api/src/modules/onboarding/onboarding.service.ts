import { Injectable } from '@nestjs/common';
import { UsersService, CompleteOnboardingDto } from '../users/users.service';
import { Archetype } from '../users/entities/user.entity';

interface OnboardingResponse {
  firstName: string;
  lastName?: string;
  username: string;
  displayName?: string;
  age?: number;
  gender?: string;
  archetype: string;
  diagnosisTimeline?: string;
  mgmtStatus?: string;
  treatmentPhase?: string;
  shareWithCommunity?: boolean;
  shareForResearch?: boolean;
}

@Injectable()
export class OnboardingService {
  constructor(private usersService: UsersService) {}

  async saveStepResponse(userId: string, step: number, response: any) {
    // Save the response and update progress
    await this.usersService.updateOnboardingProgress(userId, step);
    return { step, saved: true };
  }

  async getOnboardingStatus(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      return {
        currentStep: 0,
        completed: false,
        archetype: null,
      };
    }

    return {
      currentStep: user.onboardingStep || 0,
      completed: user.onboardingCompleted || false,
      archetype: user.archetype,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      displayName: user.displayName,
      age: user.age,
      gender: user.gender,
      diagnosisTimeline: user.diagnosisTimeline,
    };
  }

  async completeOnboarding(userId: string, data: OnboardingResponse) {
    const user = await this.usersService.completeOnboarding(userId, {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      displayName: data.displayName || data.firstName,
      age: data.age,
      gender: data.gender as any,
      archetype: data.archetype as Archetype,
      diagnosisTimeline: data.diagnosisTimeline,
      mgmtStatus: data.mgmtStatus,
      treatmentPhase: data.treatmentPhase,
      shareWithCommunity: data.shareWithCommunity,
      shareForResearch: data.shareForResearch,
    });

    return {
      completed: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        displayName: user.displayName,
        userType: user.userType,
        archetype: user.archetype,
        onboardingCompleted: user.onboardingCompleted,
      },
    };
  }
}
