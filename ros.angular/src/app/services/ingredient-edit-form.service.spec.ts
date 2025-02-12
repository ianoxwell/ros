import { inject, TestBed } from '@angular/core/testing';
import { IngredientEditFormService } from './ingredient-edit-form.service';

describe('Service: IngredientEditForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IngredientEditFormService]
    });
  });

  it('should ...', inject([IngredientEditFormService], (service: IngredientEditFormService) => {
    expect(service).toBeTruthy();
  }));
});
