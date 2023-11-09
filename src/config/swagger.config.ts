import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('swagger', async () => {
    return {
        user: process.env.SWAGGER_USER || 'test@test.com',
        password: process.env.SWAGGER_PASSWORD || 'Password1!',
    };
});
