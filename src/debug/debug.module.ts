import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebugConfig } from './entities/debug-config.entity';
import { CorsPolicy } from './entities/cors-policy.entity';
import { DebugController } from './debug.controller';
import { DebugService } from './debug.service';

@Module({
  imports: [TypeOrmModule.forFeature([DebugConfig, CorsPolicy])],
  controllers: [DebugController],
  providers: [DebugService],
  exports: [DebugService],
})
export class DebugModule {}
