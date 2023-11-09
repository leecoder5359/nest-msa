import { IEvent } from '@nestjs/cqrs';

export class VideoDownloadedEvent implements IEvent {
    constructor(readonly id: string) {}
}
