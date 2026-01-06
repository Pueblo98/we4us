import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { Message } from './entities/message.entity';

export interface CreatePostDto {
  content: string;
}

export interface CreateCommentDto {
  content: string;
}

export interface SendMessageDto {
  content: string;
}

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  // Posts
  async getFeed(userId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const [posts, total] = await this.postRepository.findAndCount({
      relations: ['author'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    // Check which posts the user has liked
    const postIds = posts.map(p => p.id);
    const userLikes = await this.likeRepository.find({
      where: { userId, postId: In(postIds) },
    });
    const likedPostIds = new Set(userLikes.map(l => l.postId));

    const postsWithLikeStatus = posts.map(post => ({
      id: post.id,
      content: post.content,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      createdAt: post.createdAt,
      author: {
        id: post.author.id,
        displayName: post.author.displayName || post.author.firstName || 'Anonymous',
        userType: post.author.userType,
        diagnosisTimeline: post.author.diagnosisTimeline,
      },
      isLiked: likedPostIds.has(post.id),
    }));

    return {
      posts: postsWithLikeStatus,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createPost(userId: string, data: CreatePostDto) {
    const post = this.postRepository.create({
      authorId: userId,
      content: data.content,
    });

    const savedPost = await this.postRepository.save(post);
    return this.getPostById(savedPost.id, userId);
  }

  async getPostById(postId: string, userId?: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let isLiked = false;
    if (userId) {
      const like = await this.likeRepository.findOne({
        where: { postId, userId },
      });
      isLiked = !!like;
    }

    return {
      id: post.id,
      content: post.content,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      createdAt: post.createdAt,
      author: {
        id: post.author.id,
        displayName: post.author.displayName || post.author.firstName || 'Anonymous',
        userType: post.author.userType,
        diagnosisTimeline: post.author.diagnosisTimeline,
      },
      isLiked,
    };
  }

  async deletePost(userId: string, postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepository.remove(post);
    return { deleted: true };
  }

  // Likes
  async toggleLike(userId: string, postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { postId, userId },
    });

    if (existingLike) {
      // Unlike
      await this.likeRepository.remove(existingLike);
      post.likesCount = Math.max(0, post.likesCount - 1);
      await this.postRepository.save(post);
      return { liked: false, likesCount: post.likesCount };
    } else {
      // Like
      const like = this.likeRepository.create({ postId, userId });
      await this.likeRepository.save(like);
      post.likesCount += 1;
      await this.postRepository.save(post);
      return { liked: true, likesCount: post.likesCount };
    }
  }

  // Comments
  async getComments(postId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { postId },
      relations: ['author'],
      order: { createdAt: 'ASC' },
      take: limit,
      skip: offset,
    });

    return {
      comments: comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        author: {
          id: comment.author.id,
          displayName: comment.author.displayName || comment.author.firstName || 'Anonymous',
        },
      })),
      page,
      limit,
      total,
    };
  }

  async addComment(userId: string, postId: string, data: CreateCommentDto) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentRepository.create({
      postId,
      authorId: userId,
      content: data.content,
    });

    const savedComment = await this.commentRepository.save(comment);

    // Update comment count
    post.commentsCount += 1;
    await this.postRepository.save(post);

    // Fetch the comment with author
    const commentWithAuthor = await this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: ['author'],
    });

    if (!commentWithAuthor) {
      throw new NotFoundException('Comment not found');
    }

    return {
      id: commentWithAuthor.id,
      content: commentWithAuthor.content,
      createdAt: commentWithAuthor.createdAt,
      author: {
        id: commentWithAuthor.author.id,
        displayName: commentWithAuthor.author.displayName || commentWithAuthor.author.firstName || 'Anonymous',
      },
    };
  }

  // Messages
  async getConversations(userId: string) {
    // Get all unique conversations (users the current user has messaged with)
    const sentMessages = await this.messageRepository
      .createQueryBuilder('message')
      .select('message.recipient_id', 'recipientId')
      .addSelect('MAX(message.created_at)', 'lastMessageAt')
      .where('message.sender_id = :userId', { userId })
      .groupBy('message.recipient_id')
      .getRawMany();

    const receivedMessages = await this.messageRepository
      .createQueryBuilder('message')
      .select('message.sender_id', 'senderId')
      .addSelect('MAX(message.created_at)', 'lastMessageAt')
      .where('message.recipient_id = :userId', { userId })
      .groupBy('message.sender_id')
      .getRawMany();

    // Combine and deduplicate
    const conversationMap = new Map<string, Date>();

    sentMessages.forEach(m => {
      const existing = conversationMap.get(m.recipientId);
      if (!existing || new Date(m.lastMessageAt) > existing) {
        conversationMap.set(m.recipientId, new Date(m.lastMessageAt));
      }
    });

    receivedMessages.forEach(m => {
      const existing = conversationMap.get(m.senderId);
      if (!existing || new Date(m.lastMessageAt) > existing) {
        conversationMap.set(m.senderId, new Date(m.lastMessageAt));
      }
    });

    // Get unread counts and last messages
    const conversations = [];
    for (const [otherUserId, lastMessageAt] of conversationMap) {
      const unreadCount = await this.messageRepository.count({
        where: { senderId: otherUserId, recipientId: userId, isRead: false },
      });

      const lastMessage = await this.messageRepository.findOne({
        where: [
          { senderId: userId, recipientId: otherUserId },
          { senderId: otherUserId, recipientId: userId },
        ],
        order: { createdAt: 'DESC' },
        relations: ['sender', 'recipient'],
      });

      if (lastMessage) {
        const otherUser = lastMessage.senderId === userId ? lastMessage.recipient : lastMessage.sender;

        conversations.push({
          otherUserId,
          otherUserName: otherUser.displayName || otherUser.firstName || 'Anonymous',
          lastMessage: lastMessage.content,
          lastMessageAt,
          unreadCount,
        });
      }
    }

    // Sort by last message time
    conversations.sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());

    return { conversations };
  }

  async getMessages(userId: string, otherUserId: string, page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit;

    const [messages, total] = await this.messageRepository.findAndCount({
      where: [
        { senderId: userId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: userId },
      ],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    // Mark received messages as read
    await this.messageRepository.update(
      { senderId: otherUserId, recipientId: userId, isRead: false },
      { isRead: true },
    );

    return {
      messages: messages.reverse().map(m => ({
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        createdAt: m.createdAt,
        isOwn: m.senderId === userId,
      })),
      page,
      limit,
      total,
    };
  }

  async sendMessage(userId: string, recipientId: string, data: SendMessageDto) {
    const message = this.messageRepository.create({
      senderId: userId,
      recipientId,
      content: data.content,
    });

    const savedMessage = await this.messageRepository.save(message);

    return {
      id: savedMessage.id,
      content: savedMessage.content,
      senderId: savedMessage.senderId,
      createdAt: savedMessage.createdAt,
      isOwn: true,
    };
  }

  async getUnreadCount(userId: string) {
    const count = await this.messageRepository.count({
      where: { recipientId: userId, isRead: false },
    });
    return { unreadCount: count };
  }

  // Forums (static for now)
  async getForums() {
    return {
      forums: [
        { id: '1', name: 'Treatment Experiences', slug: 'treatment', postCount: 0 },
        { id: '2', name: 'Side Effect Management', slug: 'side-effects', postCount: 0 },
        { id: '3', name: 'Caregiver Support', slug: 'caregivers', postCount: 0 },
        { id: '4', name: 'Complementary Approaches', slug: 'complementary', postCount: 0 },
      ],
    };
  }
}
