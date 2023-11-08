import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { SigninReqDto, SignupReqDto } from './dto/req.dto';
import { SignupResDto } from './dto/res.dto';
import { ApiPostResponse } from '../common/decorator/swagger.decorator';
import { Public } from '../common/decorator/public.decorator';

@ApiTags('Auth')
@ApiExtraModels(SignupResDto)
@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiPostResponse(SignupResDto)
    @Public()
    @Post('signup')
    async signup(@Body() { email, password, passwordConfirm }: SignupReqDto) {
        if (password !== passwordConfirm) throw new BadRequestException();
        const { id } = await this.authService.signup(email, password);
        return { id };
    }

    @ApiPostResponse(SigninReqDto)
    @Public()
    @Post('signin')
    async signin(@Body() { email, password }: SigninReqDto) {
        return this.authService.signin(email, password);
    }
}
