import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JournalService, CreateJournalEntryDto, UpdateJournalEntryDto, SaveCheckinDto } from './journal.service';

@Controller('journal')
@UseGuards(AuthGuard('jwt'))
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  // Journal Entries
  @Get('entries')
  async getEntries(
    @Request() req: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.journalService.getJournalEntries(
      req.user.userId,
      limit ? parseInt(limit) : 20,
      offset ? parseInt(offset) : 0,
    );
  }

  @Get('entries/:id')
  async getEntry(@Request() req: any, @Param('id') id: string) {
    return this.journalService.getJournalEntry(req.user.userId, id);
  }

  @Post('entries')
  async createEntry(@Request() req: any, @Body() body: CreateJournalEntryDto) {
    return this.journalService.createJournalEntry(req.user.userId, body);
  }

  @Put('entries/:id')
  async updateEntry(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: UpdateJournalEntryDto,
  ) {
    return this.journalService.updateJournalEntry(req.user.userId, id, body);
  }

  @Delete('entries/:id')
  async deleteEntry(@Request() req: any, @Param('id') id: string) {
    return this.journalService.deleteJournalEntry(req.user.userId, id);
  }

  // Daily Check-ins
  @Get('checkin/today')
  async getTodayCheckin(@Request() req: any) {
    return this.journalService.getTodayCheckin(req.user.userId);
  }

  @Post('checkin')
  async saveCheckin(@Request() req: any, @Body() body: SaveCheckinDto) {
    return this.journalService.saveCheckin(req.user.userId, body);
  }

  @Get('checkin/history')
  async getCheckinHistory(@Request() req: any, @Query('days') days?: string) {
    return this.journalService.getCheckinHistory(req.user.userId, days ? parseInt(days) : 30);
  }

  // Symptom Trends
  @Get('symptoms/trends')
  async getSymptomTrends(@Request() req: any, @Query('days') days?: string) {
    return this.journalService.getSymptomTrends(req.user.userId, days ? parseInt(days) : 30);
  }
}
