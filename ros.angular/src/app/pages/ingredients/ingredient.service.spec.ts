import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { IngredientService } from './ingredient.service';

describe('ingredientService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
  );

  it('should be created', () => {
    const service: IngredientService = TestBed.inject(IngredientService);
    expect(service).toBeTruthy();
  });
});
