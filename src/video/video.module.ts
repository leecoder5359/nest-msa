import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entity/video.entity';
import { VideoController } from './video.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateVideoHandler } from './command/handler/create-video.handler';
import { VideoCreatedHandler } from './event/handler/video-created.handler';
import { FindVideosQueryHandler } from './query/handler/find-videos.handler';
import { FindOneVideoHandler } from './query/handler/find-one-video.handler';
import { DownloadVideoHandler } from './command/handler/download-video.handler';
import { VideoDownloadedHandler } from './event/handler/video-downloaded.handler';
import { VideoService } from './video.service';

@Module({
    imports: [TypeOrmModule.forFeature([Video]), CqrsModule],
    controllers: [VideoController],
    providers: [
        CreateVideoHandler,
        VideoCreatedHandler,
        FindVideosQueryHandler,
        FindOneVideoHandler,
        DownloadVideoHandler,
        VideoDownloadedHandler,
        VideoService,
    ],
    exports: [VideoService],
})
export class VideoModule {}
