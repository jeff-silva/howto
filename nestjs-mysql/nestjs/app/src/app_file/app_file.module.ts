import { Module } from '@nestjs/common';
import { AppFileService } from './app_file.service';
import { AppFileController } from './app_file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppFile } from './app_file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppFile])],
  controllers: [AppFileController],
  providers: [AppFileService],
  exports: [AppFileService],
})
export class AppFileModule {}
