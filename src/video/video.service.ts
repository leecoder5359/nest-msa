import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entity/video.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VideoService {
    constructor(@InjectRepository(Video) private readonly videoRepository: Repository<Video>) {}

    async findTop5Download() {
        return this.videoRepository.find({
            relations: ['user'],
            order: {
                downloadCnt: 'DESC',
            },
            take: 5,
        });
    }
}
