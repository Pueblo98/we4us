import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { JournalModule } from './modules/journal/journal.module';
import { CommunityModule } from './modules/community/community.module';

// Import all entities explicitly
import { User } from './modules/users/entities/user.entity';
import { PatientProfile } from './modules/users/entities/patient-profile.entity';
import { JournalEntry } from './modules/journal/entities/journal-entry.entity';
import { DailyCheckin } from './modules/journal/entities/daily-checkin.entity';
import { Post } from './modules/community/entities/post.entity';
import { Comment } from './modules/community/entities/comment.entity';
import { Like } from './modules/community/entities/like.entity';
import { Message } from './modules/community/entities/message.entity';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'we4us'),
        password: configService.get('DB_PASSWORD', 'we4us_dev_password'),
        database: configService.get('DB_DATABASE', 'we4us_gbm'),
        entities: [
          User,
          PatientProfile,
          JournalEntry,
          DailyCheckin,
          Post,
          Comment,
          Like,
          Message,
        ],
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    OnboardingModule,
    JournalModule,
    CommunityModule,
  ],
})
export class AppModule {}
