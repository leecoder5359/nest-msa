import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './entity/video.entity';
import { ReadStream } from 'typeorm/browser/platform/BrowserPlatformTools';
import { join } from 'path';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

@Injectable()
export class VideoService {
    constructor(@InjectRepository(Video) private videoRepository: Repository<Video>) {}

    async download(id: string): Promise<{ stream: ReadStream; mimetype: string; size: number }> {
        const video = await this.videoRepository.findOneBy({ id });
        if (!video) throw new NotFoundException('No Video');

        await this.videoRepository.update({ id }, { downloadCnt: () => 'download_cnt + 1' });

        const { mimetype } = video;
        const extension = mimetype.split('/')[1];
        const videoPath = join(process.cwd(), 'video-storage', `${id}.${extension}`);
        const { size } = await stat(videoPath);
        const stream = createReadStream(videoPath);
        return { stream, mimetype, size };
    }
}
