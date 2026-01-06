import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OnboardingService } from './onboarding.service';
import { IsString, IsOptional, IsNumber, IsIn, IsBoolean, MinLength } from 'class-validator';

class CompleteOnboardingDto {
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsIn(['male', 'female', 'non-binary', 'prefer-not-to-say'])
  gender?: string;

  @IsIn(['information_seeker', 'connection_seeker', 'action_oriented', 'newly_diagnosed'])
  archetype: string;

  @IsOptional()
  @IsIn(['newly_diagnosed', '1_month', '3_months', '6_months', '1_year_plus'])
  diagnosisTimeline?: string;

  @IsOptional()
  @IsIn(['methylated', 'unmethylated', 'unknown'])
  mgmtStatus?: string;

  @IsOptional()
  @IsString()
  treatmentPhase?: string;

  @IsOptional()
  @IsBoolean()
  shareWithCommunity?: boolean;

  @IsOptional()
  @IsBoolean()
  shareForResearch?: boolean;
}

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('status')
  @UseGuards(AuthGuard('jwt'))
  async getStatus(@Request() req: any) {
    return this.onboardingService.getOnboardingStatus(req.user.userId);
  }

  @Post('step/:step')
  @UseGuards(AuthGuard('jwt'))
  async saveStep(
    @Param('step') step: string,
    @Body() body: any,
    @Request() req: any,
  ) {
    return this.onboardingService.saveStepResponse(req.user.userId, parseInt(step), body);
  }

  @Post('complete')
  @UseGuards(AuthGuard('jwt'))
  async complete(@Body() body: CompleteOnboardingDto, @Request() req: any) {
    return this.onboardingService.completeOnboarding(req.user.userId, body);
  }
}
