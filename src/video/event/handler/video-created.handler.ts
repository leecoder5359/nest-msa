import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { VideoCreatedEvent } from '../video-created.event';
import { Injectable } from '@nestjs/common';

@Injectable()
@EventsHandler(VideoCreatedEvent)
export class VideoCreatedHandler implements IEventHandler<VideoCreatedEvent> {
    handle(event: VideoCreatedEvent) {
        console.info(`Video created(id: ${event.id})`);
    }
}
