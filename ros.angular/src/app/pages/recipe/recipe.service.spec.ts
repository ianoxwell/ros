import { TestBed } from '@angular/core/testing';
import { RecipeService } from './recipe.service';

describe('RecipeingredientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecipeService = TestBed.inject(RecipeService);
    expect(service).toBeTruthy();
  });
});
