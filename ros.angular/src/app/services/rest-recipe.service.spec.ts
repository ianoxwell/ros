import { TestBed } from '@angular/core/testing';
import { RestRecipeService } from './rest-recipe.service';

describe('RecipeRestIngredientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RestRecipeService = TestBed.inject(RestRecipeService);
    expect(service).toBeTruthy();
  });
});
