import { Test, TestingModule } from '@nestjs/testing';
import { SpoonController } from './spoon.controller';

describe('SpoonController', () => {
  let controller: SpoonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpoonController]
    }).compile();

    controller = module.get<SpoonController>(SpoonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
