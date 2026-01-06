import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { UserType, User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string, userType: UserType) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      userType,
      passwordHash,
    });

    return this.generateAuthResponse(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateAuthResponse(user);
  }

  async requestMagicLink(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return { message: 'If an account exists with this email, a magic link has been sent' };
    }

    // TODO: Implement magic link email sending
    // For now, just return success message
    return { message: 'If an account exists with this email, a magic link has been sent' };
  }

  async verifyMagicLink(token: string) {
    // TODO: Implement magic link verification
    throw new UnauthorizedException('Invalid or expired magic link');
  }

  private generateAuthResponse(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      expires_in: '7d',
      user: this.sanitizeUser(user),
    };
  }

  private sanitizeUser(user: User) {
    // Remove sensitive fields before returning
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      gender: user.gender,
      userType: user.userType,
      archetype: user.archetype,
      onboardingCompleted: user.onboardingCompleted,
      createdAt: user.createdAt,
    };
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.sanitizeUser(user);
  }
}
