import { Test, TestingModule } from '@nestjs/testing';
import { HealthLabelService } from './health-label.service';

describe('HealthLabelService', () => {
  let service: HealthLabelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthLabelService]
    }).compile();

    service = module.get<HealthLabelService>(HealthLabelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
