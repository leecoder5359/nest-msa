import { Injectable, Logger } from '@nestjs/common';
import { VideoService } from '../video/video.service';
import { EmailService } from '../email/email.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AnalyticsService {
    constructor(private readonly videoService: VideoService, private readonly emailService: EmailService) {}

    @Cron(CronExpression.EVERY_DAY_AT_10AM)
    async handleEmailCron() {
        Logger.log('Email task calld');
        const videos = await this.videoService.findTop5Download();
        await this.emailService.send(videos);
    }
}
