import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { JournalEntry, JournalMood } from './entities/journal-entry.entity';
import { DailyCheckin } from './entities/daily-checkin.entity';

export interface CreateJournalEntryDto {
  title: string;
  content: string;
  mood?: JournalMood;
  isPrivate?: boolean;
}

export interface UpdateJournalEntryDto {
  title?: string;
  content?: string;
  mood?: JournalMood;
  isPrivate?: boolean;
}

export interface SaveCheckinDto {
  energyLevel: number;
  painLevel: number;
  moodLevel: number;
  cognitiveClarity: number;
  notes?: string;
}

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(JournalEntry)
    private journalEntryRepository: Repository<JournalEntry>,
    @InjectRepository(DailyCheckin)
    private checkinRepository: Repository<DailyCheckin>,
  ) {}

  // Journal Entries
  async getJournalEntries(userId: string, limit: number = 20, offset: number = 0) {
    const [entries, total] = await this.journalEntryRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return { entries, total };
  }

  async getJournalEntry(userId: string, entryId: string) {
    const entry = await this.journalEntryRepository.findOne({
      where: { id: entryId, userId },
    });

    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }

    return entry;
  }

  async createJournalEntry(userId: string, data: CreateJournalEntryDto) {
    const entry = this.journalEntryRepository.create({
      userId,
      title: data.title,
      content: data.content,
      mood: data.mood,
      isPrivate: data.isPrivate ?? false,
    });

    return this.journalEntryRepository.save(entry);
  }

  async updateJournalEntry(userId: string, entryId: string, data: UpdateJournalEntryDto) {
    const entry = await this.getJournalEntry(userId, entryId);

    Object.assign(entry, data);
    return this.journalEntryRepository.save(entry);
  }

  async deleteJournalEntry(userId: string, entryId: string) {
    const entry = await this.getJournalEntry(userId, entryId);
    await this.journalEntryRepository.remove(entry);
    return { deleted: true };
  }

  // Daily Check-ins
  async getTodayCheckin(userId: string) {
    const today = new Date().toISOString().split('T')[0];

    const checkin = await this.checkinRepository.findOne({
      where: { userId, date: today },
    });

    return checkin;
  }

  async saveCheckin(userId: string, data: SaveCheckinDto) {
    const today = new Date().toISOString().split('T')[0];

    // Try to find existing check-in for today
    let checkin = await this.checkinRepository.findOne({
      where: { userId, date: today },
    });

    if (checkin) {
      // Update existing check-in
      Object.assign(checkin, data);
    } else {
      // Create new check-in
      checkin = this.checkinRepository.create({
        userId,
        date: today,
        ...data,
      });
    }

    return this.checkinRepository.save(checkin);
  }

  async getCheckinHistory(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const checkins = await this.checkinRepository.find({
      where: {
        userId,
        date: MoreThanOrEqual(startDateStr),
      },
      order: { date: 'DESC' },
    });

    return { checkins, period: days };
  }

  // Symptom trends (aggregated from check-ins)
  async getSymptomTrends(userId: string, days: number = 30) {
    const { checkins } = await this.getCheckinHistory(userId, days);

    // Calculate averages
    if (checkins.length === 0) {
      return { trends: [], period: days, averages: null };
    }

    const averages = {
      energyLevel: checkins.reduce((sum, c) => sum + c.energyLevel, 0) / checkins.length,
      painLevel: checkins.reduce((sum, c) => sum + c.painLevel, 0) / checkins.length,
      moodLevel: checkins.reduce((sum, c) => sum + c.moodLevel, 0) / checkins.length,
      cognitiveClarity: checkins.reduce((sum, c) => sum + c.cognitiveClarity, 0) / checkins.length,
    };

    return {
      trends: checkins.map(c => ({
        date: c.date,
        energyLevel: c.energyLevel,
        painLevel: c.painLevel,
        moodLevel: c.moodLevel,
        cognitiveClarity: c.cognitiveClarity,
      })),
      period: days,
      averages,
    };
  }
}
