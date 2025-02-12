import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RestIngredientService } from './rest-ingredient.service';

describe('RestIngredientService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

  it('should be created', () => {
    const service: RestIngredientService = TestBed.inject(RestIngredientService);
    expect(service).toBeTruthy();
  });
});
