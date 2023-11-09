import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { VideoService } from './video.service';
import { CreateVideoReqDto, FindVideoReqDto } from './dto/req.dto';
import { PageReqDto } from '../common/dto/req.dto';
import { ApiGetItemsResponse, ApiGetResponse, ApiPostResponse } from '../common/decorator/swagger.decorator';
import { CreateVideoResDto, FindVideoResDto } from './dto/res.dto';
import { PageResDto } from '../common/dto/res.dto';
import { ThrottlerBehindProxyGuard } from '../common/guard/throttler-behind-proxy.guard';
import { Throttle } from '@nestjs/throttler';
import { User, UserAfterAuth } from '../common/decorator/user.decorator';
import { CreateVideoCommand } from './command/create-video.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindVideosQuery } from './query/find-videos.query';

@ApiTags('Video')
@ApiExtraModels(FindVideoReqDto, PageReqDto, PageResDto, FindVideoResDto, CreateVideoResDto)
@UseGuards(ThrottlerBehindProxyGuard)
@Controller('api/videos')
export class VideoController {
    constructor(
        private readonly videoService: VideoService,
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @ApiBearerAuth()
    @ApiPostResponse(CreateVideoResDto)
    @Post()
    async upload(@Body() createVideoReqDto: CreateVideoReqDto, @User() user: UserAfterAuth) {
        const { title, video } = createVideoReqDto;
        const command = new CreateVideoCommand(user.id, title, 'video/mp4', 'mp4', Buffer.from(''));
        const { id } = await this.commandBus.execute(command);
        return { id, title };
    }

    @ApiBearerAuth()
    @ApiGetItemsResponse(FindVideoResDto)
    @Get()
    async findAll(@Query() { page, size }: PageReqDto): Promise<FindVideoResDto[]> {
        const fineVideoQuery = new FindVideosQuery(page, size);
        const videos = await this.queryBus.execute(fineVideoQuery);
        return videos.map(({ id, title, user }) => {
            return {
                id,
                title,
                user: {
                    id: user.id,
                    email: user.email,
                },
            };
        });
    }

    @ApiBearerAuth()
    @ApiGetResponse(FindVideoResDto)
    @Get(':id')
    findOne(@Param() { id }: FindVideoReqDto) {
        return this.videoService.findOne(id);
    }

    @ApiBearerAuth()
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @Get(':id/download')
    async download(@Param() { id }: FindVideoReqDto) {
        return this.videoService.download(id);
    }
}
