import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entity/video.entity';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateVideoHandler } from './handler/create-video.handler';
import { VideoCreatedHandler } from './handler/video-created.handler';
import { FindVideosQueryHandler } from './handler/find-videos.handler';
import { FindOneVideoHandler } from './handler/find-one-video.handler';

@Module({
    imports: [TypeOrmModule.forFeature([Video]), CqrsModule],
    controllers: [VideoController],
    providers: [VideoService, CreateVideoHandler, VideoCreatedHandler, FindVideosQueryHandler, FindOneVideoHandler],
})
export class VideoModule {}
