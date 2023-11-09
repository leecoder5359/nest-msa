import { ICommand } from '@nestjs/cqrs';

export class DownloadVideoCommand implements ICommand {
    constructor(readonly id: string) {}
}
