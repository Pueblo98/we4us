import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommunityService, CreatePostDto, CreateCommentDto, SendMessageDto } from './community.service';
import { MatchingService } from './matching.service';

@Controller('community')
@UseGuards(AuthGuard('jwt'))
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly matchingService: MatchingService,
  ) {}

  // Feed & Posts
  @Get('feed')
  async getFeed(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.communityService.getFeed(
      req.user.userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Post('posts')
  async createPost(@Request() req: any, @Body() body: CreatePostDto) {
    return this.communityService.createPost(req.user.userId, body);
  }

  @Get('posts/:id')
  async getPost(@Request() req: any, @Param('id') id: string) {
    return this.communityService.getPostById(id, req.user.userId);
  }

  @Delete('posts/:id')
  async deletePost(@Request() req: any, @Param('id') id: string) {
    return this.communityService.deletePost(req.user.userId, id);
  }

  // Likes
  @Post('posts/:id/like')
  async toggleLike(@Request() req: any, @Param('id') id: string) {
    return this.communityService.toggleLike(req.user.userId, id);
  }

  // Comments
  @Get('posts/:id/comments')
  async getComments(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.communityService.getComments(
      id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Post('posts/:id/comments')
  async addComment(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: CreateCommentDto,
  ) {
    return this.communityService.addComment(req.user.userId, id, body);
  }

  // Messages
  @Get('messages')
  async getConversations(@Request() req: any) {
    return this.communityService.getConversations(req.user.userId);
  }

  @Get('messages/unread')
  async getUnreadCount(@Request() req: any) {
    return this.communityService.getUnreadCount(req.user.userId);
  }

  @Get('messages/:userId')
  async getMessages(
    @Request() req: any,
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.communityService.getMessages(
      req.user.userId,
      userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Post('messages/:userId')
  async sendMessage(
    @Request() req: any,
    @Param('userId') userId: string,
    @Body() body: SendMessageDto,
  ) {
    return this.communityService.sendMessage(req.user.userId, userId, body);
  }

  // Patient Matching
  @Get('matches')
  async getMatches(@Request() req: any, @Query('limit') limit?: string) {
    return this.matchingService.getMatches(req.user.userId, limit ? parseInt(limit) : 10);
  }

  // Forums
  @Get('forums')
  async getForums() {
    return this.communityService.getForums();
  }
}
