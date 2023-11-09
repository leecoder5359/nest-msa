import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { VideoDownloadedEvent } from '../video-downloaded.event';

@Injectable()
@EventsHandler(VideoDownloadedEvent)
export class VideoDownloadedHandler implements IEventHandler<VideoDownloadedEvent> {
    handle(event: VideoDownloadedEvent) {
        console.log(`Video downloaded (id: ${event.id}) - download를 mongo로 저장 로직 필요`);
    }
}
