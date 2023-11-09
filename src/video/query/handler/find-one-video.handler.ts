import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindVideosQuery } from '../find-videos.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from '../../entity/video.entity';
import { Repository } from 'typeorm';
import { FindOneVideoQuery } from '../find-one-video.query';

@Injectable()
@QueryHandler(FindOneVideoQuery)
export class FindOneVideoHandler implements IQueryHandler<FindOneVideoQuery> {
    constructor(@InjectRepository(Video) private videoRepository: Repository<Video>) {}

    async execute({ id }: FindOneVideoQuery): Promise<Video> {
        const video = await this.videoRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        return video;
    }
}
