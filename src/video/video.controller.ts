import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseFilePipeBuilder,
    Post,
    Query,
    Res,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiExtraModels, ApiTags } from '@nestjs/swagger';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { FindOneVideoQuery } from './query/find-one-video.query';
import { Response } from 'express';

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
    @ApiConsumes('multipart/form-data')
    @ApiPostResponse(CreateVideoResDto)
    @UseInterceptors(FileInterceptor('video'))
    @Post()
    async upload(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({ fileType: 'mp4' })
                .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                }),
        )
        file: Express.Multer.File,
        @Body()
        createVideoReqDto: CreateVideoReqDto,
        @User() user: UserAfterAuth,
    ) {
        const { mimetype, originalname, buffer } = file;
        const extension = originalname.split('.')[1];
        const { title } = createVideoReqDto;
        const command = new CreateVideoCommand(user.id, title, mimetype, extension, buffer);
        const { id } = await this.commandBus.execute(command);
        return { id, title };
    }

    @ApiBearerAuth()
    @ApiGetItemsResponse(FindVideoResDto)
    @Get()
    async findAll(@Query() { page, size }: PageReqDto): Promise<FindVideoResDto[]> {
        const findVideosQuery = new FindVideosQuery(page, size);
        const videos = await this.queryBus.execute(findVideosQuery);
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
    async findOne(@Param() { id }: FindVideoReqDto): Promise<FindVideoResDto> {
        const findOneVideoQuery = new FindOneVideoQuery(id);
        const { title, user } = await this.queryBus.execute(findOneVideoQuery);
        return {
            id,
            title,
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }

    @ApiBearerAuth()
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @Get(':id/download')
    async download(@Param() { id }: FindVideoReqDto, @Res({ passthrough: true }) res: Response) {
        const { stream, mimetype, size } = await this.videoService.download(id);
        res.set({
            'Content-Length': size,
            'Content-Type': mimetype,
            'Content-Disposition': 'attachment;',
        });

        return new StreamableFile(<Uint8Array>stream);
    }
}
