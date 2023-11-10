import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Analytics } from './entity/analytics.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AnalyticsService {
    constructor(@InjectRepository(Analytics) private analyticsRepository: Repository<Analytics>) {}
    async updateDownloadCountByVideoId(videoId: string) {
        const analytics = await this.analyticsRepository.findOneBy({ videoId });

        if (!analytics) {
            await this.analyticsRepository.save(this.analyticsRepository.create({ videoId, downloadCnt: 1 }));
            return;
        }

        await this.analyticsRepository.update({ id: analytics.id }, { downloadCnt: () => 'download_cnt + 1' });
    }
}
