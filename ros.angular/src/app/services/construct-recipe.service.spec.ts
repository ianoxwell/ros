import { inject, TestBed } from '@angular/core/testing';
import { ConstructRecipeService } from './construct-recipe.service';

describe('Service: ConstructRecipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConstructRecipeService]
    });
  });

  it('should ...', inject([ConstructRecipeService], (service: ConstructRecipeService) => {
    expect(service).toBeTruthy();
  }));
});
