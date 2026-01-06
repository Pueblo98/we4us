import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { MatchingService } from './matching.service';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { Message } from './entities/message.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment, Like, Message]),
    UsersModule,
  ],
  controllers: [CommunityController],
  providers: [CommunityService, MatchingService],
  exports: [CommunityService],
})
export class CommunityModule {}
