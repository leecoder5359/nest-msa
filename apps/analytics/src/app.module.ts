import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AnalyticsModule } from './analytics/analytics.module';
import postgresConfig from './analytics/config/postgres.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [postgresConfig],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                let obj: TypeOrmModuleOptions = {
                    type: 'postgres',
                    host: configService.get('postgres.host'),
                    port: configService.get('postgres.port'),
                    database: configService.get('postgres.database'),
                    username: configService.get('postgres.username'),
                    password: configService.get('postgres.password'),
                    autoLoadEntities: true,
                    synchronize: false,
                };

                if (configService.get('STAGE') === 'local') {
                    obj = Object.assign(obj, {
                        logging: true,
                        synchronize: true,
                    });
                }
                return obj;
            },
        }),
        AnalyticsModule,
    ],
})
export class AppModule {}