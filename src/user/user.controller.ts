import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { FindUserReqDto } from './dto/req.dto';
import { PageReqDto } from '../common/dto/req.dto';
import { ApiGetItemsResponse, ApiGetResponse } from '../common/decorator/swagger.decorator';
import { FindUserResDto } from './dto/res.dto';
import { UserAfterAuth, User } from '../common/decorator/user.decorator';

@ApiTags('User')
@ApiExtraModels(FindUserReqDto, PageReqDto, FindUserResDto)
@Controller('api/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiBearerAuth()
    @ApiGetItemsResponse(FindUserResDto)
    @Get()
    findAll(@Query() { page, size }: PageReqDto, @User() user: UserAfterAuth) {
        console.log(user);
        return this.userService.findAll();
    }

    @ApiBearerAuth()
    @ApiGetResponse(FindUserResDto)
    @Get(':id')
    findOne(@Param() { id }: FindUserReqDto) {
        return this.userService.findOne(id);
    }
}
