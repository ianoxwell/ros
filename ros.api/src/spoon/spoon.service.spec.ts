import { Test, TestingModule } from '@nestjs/testing';
import { SpoonService } from './spoon.service';

describe('SpoonService', () => {
  let service: SpoonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpoonService]
    }).compile();

    service = module.get<SpoonService>(SpoonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
