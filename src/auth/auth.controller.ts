import { Controller, Post, Body, BadRequestException, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { SigninReqDto, SignupReqDto } from './dto/req.dto';
import { RefreshResDto, SigninResDto, SignupResDto } from './dto/res.dto';
import { ApiPostResponse } from '../common/decorator/swagger.decorator';
import { Public } from '../common/decorator/public.decorator';
import { User, UserAfterAuth } from '../common/decorator/user.decorator';
import { HeaderUtil } from '../common/util/header.util';

@ApiTags('Auth')
@ApiExtraModels(SignupResDto, SigninResDto, RefreshResDto)
@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiPostResponse(SignupResDto)
    @Public()
    @Post('signup')
    async signup(@Body() { email, password, passwordConfirm }: SignupReqDto): Promise<SignupResDto> {
        if (password !== passwordConfirm) throw new BadRequestException();
        const { id, accessToken, refreshToken } = await this.authService.signup(email, password);
        return { id, accessToken, refreshToken };
    }

    @ApiPostResponse(SigninResDto)
    @Public()
    @Post('signin')
    async signin(@Body() { email, password }: SigninReqDto) {
        return this.authService.signin(email, password);
    }

    @ApiPostResponse(RefreshResDto)
    @ApiBearerAuth()
    @Post('refresh')
    async refresh(@Headers('authorization') authorization, @User() user: UserAfterAuth) {
        const token = HeaderUtil.getToken(authorization);
        const { accessToken, refreshToken } = await this.authService.refresh(token, user.id);
        return { accessToken, refreshToken };
    }
}
