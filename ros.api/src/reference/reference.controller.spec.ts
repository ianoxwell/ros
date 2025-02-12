import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceController } from './reference.controller';

describe('ReferenceController', () => {
  let controller: ReferenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferenceController]
    }).compile();

    controller = module.get<ReferenceController>(ReferenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
