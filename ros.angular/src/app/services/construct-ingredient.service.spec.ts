import { TestBed } from '@angular/core/testing';
import { ConstructIngredientService } from './construct-ingredient.service';

describe('ConstructIngredientService', () => {
  let service: ConstructIngredientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstructIngredientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
