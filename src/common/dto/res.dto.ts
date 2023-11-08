import { ApiProperty } from '@nestjs/swagger';

export class PageResDto<T> {
    @ApiProperty({ required: true })
    page: number;

    @ApiProperty({ required: true })
    size: number;

    items: T[];
}
