import { Module } from '@nestjs/common';
import { AppUserGroupService } from './app_user_group.service';
import { AppUserGroupController } from './app_user_group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUserGroup } from './app_user_group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppUserGroup])],
  controllers: [AppUserGroupController],
  providers: [AppUserGroupService],
  exports: [AppUserGroupService],
})
export class AppUserGroupModule {}
