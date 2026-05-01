import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const createTypeOrmConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get<string>('DB_HOST', 'localhost'),
  port: Number(config.get<string>('DB_PORT', '5432')),
  username: config.get<string>('DB_USERNAME', 'broken_regist'),
  password: config.get<string>('DB_PASSWORD', 'broken_regist_password'),
  database: config.get<string>('DB_DATABASE', 'broken_regist'),
  autoLoadEntities: true,
  synchronize: config.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
});
