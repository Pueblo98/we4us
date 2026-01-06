import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { IsEmail, IsString, IsIn, MinLength } from 'class-validator';

class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsIn(['patient', 'caregiver'])
  userType: 'patient' | 'caregiver';
}

class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

class MagicLinkDto {
  @IsEmail()
  email: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body.email, body.password, body.userType);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('magic-link')
  async requestMagicLink(@Body() body: MagicLinkDto) {
    return this.authService.requestMagicLink(body.email);
  }

  @Post('magic-link/verify')
  async verifyMagicLink(@Body('token') token: string) {
    return this.authService.verifyMagicLink(token);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@Request() req: any) {
    return this.authService.getCurrentUser(req.user.userId);
  }
}
