import { Test, TestingModule } from '@nestjs/testing';
import { AppUserGroupController } from './app_user_group.controller';
import { AppUserGroupService } from './app_user_group.service';

describe('AppUserGroupController', () => {
  let controller: AppUserGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppUserGroupController],
      providers: [AppUserGroupService],
    }).compile();

    controller = module.get<AppUserGroupController>(AppUserGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
