import { Controller, Get, Patch, Body, UseGuards, Request, Param, Query, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService, UpdateUserDto } from './users.service';
import { IsString, IsOptional, IsNumber, IsIn, IsBoolean, MinLength } from 'class-validator';

class UpdateProfileDto implements UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsIn(['male', 'female', 'non-binary', 'prefer-not-to-say'])
  gender?: any;

  @IsOptional()
  @IsBoolean()
  shareWithCommunity?: boolean;

  @IsOptional()
  @IsBoolean()
  shareForResearch?: boolean;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get patient profile if applicable
    let patientProfile = null;
    if (user.userType === 'patient') {
      patientProfile = await this.usersService.getPatientProfile(user.id);
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      displayName: user.displayName,
      age: user.age,
      gender: user.gender,
      userType: user.userType,
      archetype: user.archetype,
      diagnosisTimeline: user.diagnosisTimeline,
      onboardingCompleted: user.onboardingCompleted,
      shareWithCommunity: user.shareWithCommunity,
      shareForResearch: user.shareForResearch,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      patientProfile,
    };
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Request() req: any, @Body() body: UpdateProfileDto) {
    const updatedUser = await this.usersService.update(req.user.userId, body);
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      username: updatedUser.username,
      displayName: updatedUser.displayName,
      age: updatedUser.age,
      gender: updatedUser.gender,
      userType: updatedUser.userType,
      archetype: updatedUser.archetype,
      onboardingCompleted: updatedUser.onboardingCompleted,
      shareWithCommunity: updatedUser.shareWithCommunity,
      shareForResearch: updatedUser.shareForResearch,
    };
  }

  @Get('username/check')
  async checkUsername(@Query('username') username: string, @Query('excludeUserId') excludeUserId?: string) {
    if (!username || username.length < 3) {
      return { available: false, message: 'Username must be at least 3 characters' };
    }

    const available = await this.usersService.isUsernameAvailable(username, excludeUserId);
    return { available };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Return public profile only
    return {
      id: user.id,
      displayName: user.displayName,
      username: user.username,
      userType: user.userType,
      archetype: user.archetype,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      isMemorial: user.isMemorial,
    };
  }
}
