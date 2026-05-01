import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { createTypeOrmConfig } from './config/typeorm.config';
import { CoursesModule } from './courses/courses.module';
import { DebugModule } from './debug/debug.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { FilesModule } from './files/files.module';
import { LogsModule } from './logs/logs.module';
import { ProfessorsModule } from './professors/professors.module';
import { SystemModule } from './system/system.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createTypeOrmConfig,
    }),
    AuthModule,
    UsersModule,
    ProfessorsModule,
    CoursesModule,
    EnrollmentsModule,
    FilesModule,
    AdminModule,
    DebugModule,
    LogsModule,
    SystemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
