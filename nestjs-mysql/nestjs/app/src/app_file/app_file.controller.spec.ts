import { Test, TestingModule } from '@nestjs/testing';
import { AppFileController } from './app_file.controller';
import { AppFileService } from './app_file.service';

describe('AppFileController', () => {
  let controller: AppFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppFileController],
      providers: [AppFileService],
    }).compile();

    controller = module.get<AppFileController>(AppFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
