import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
    user: process.env.GOOGLE_EMAIL_USER,
    pass: process.env.GOOGLE_EMAIL_PASSWORD,
}));
