import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { JournalEntry } from './entities/journal-entry.entity';
import { DailyCheckin } from './entities/daily-checkin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JournalEntry, DailyCheckin])],
  controllers: [JournalController],
  providers: [JournalService],
  exports: [JournalService],
})
export class JournalModule {}
