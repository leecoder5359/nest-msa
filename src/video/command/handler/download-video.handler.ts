import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DownloadVideoCommand } from '../download-video.command';
import { DataSource } from 'typeorm';
import { Video } from '../../entity/video.entity';
import { createReadStream } from 'fs';
import { join } from 'path';
import { stat } from 'fs/promises';
import { VideoDownloadedEvent } from '../../event/video-downloaded.event';

@Injectable()
@CommandHandler(DownloadVideoCommand)
export class DownloadVideoHandler implements ICommandHandler<DownloadVideoCommand> {
    constructor(private dataSource: DataSource, private eventBus: EventBus) {}

    async execute(command: DownloadVideoCommand) {
        const { id } = command;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        let error;
        try {
            const video = await queryRunner.manager.findOneBy(Video, { id });
            if (!video) throw new NotFoundException('No Video');

            await queryRunner.manager.update(Video, { id }, { downloadCnt: () => 'download_cnt + 1' });

            const { mimetype } = video;
            const extension = mimetype.split('/')[1];
            const videoPath = join(process.cwd(), 'video-storage', `${id}.${extension}`);
            const { size } = await stat(videoPath);
            const stream = createReadStream(videoPath);

            await queryRunner.commitTransaction();
            this.eventBus.publish(new VideoDownloadedEvent(id));
            return { stream, mimetype, size };
        } catch (e) {
            await queryRunner.rollbackTransaction();
            error = e;
        } finally {
            await queryRunner.release();
            if (error) throw error;
        }
    }
}
