import { Test, TestingModule } from '@nestjs/testing';
import { AppUserGroupService } from './app_user_group.service';

describe('AppUserGroupService', () => {
  let service: AppUserGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppUserGroupService],
    }).compile();

    service = module.get<AppUserGroupService>(AppUserGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
