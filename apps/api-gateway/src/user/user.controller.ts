import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { RefreshResDto, SigninResDto, SignupResDto } from '../auth/dto/res.dto';
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiGetItemsResponse } from '../common/decorator/swagger.decorator';
import { FindUserResDto } from './dto/res.dto';
import { Role } from './enum/user.enum';
import { Roles } from '../common/decorator/role.decorator';

@ApiTags('User')
@ApiExtraModels(FindUserResDto)
@Controller('api/user')
export class UserController {
    constructor(private userService: UserService) {}

    @ApiBearerAuth()
    @ApiGetItemsResponse(FindUserResDto)
    @Roles(Role.Admin)
    @Get()
    async getUsers() {
        return this.userService.getAllUsers();
    }
}
