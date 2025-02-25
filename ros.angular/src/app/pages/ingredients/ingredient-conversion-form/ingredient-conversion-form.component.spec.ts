import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientConversionFormComponent } from './ingredient-conversion-form.component';

describe('IngredientConversionFormComponent', () => {
  let component: IngredientConversionFormComponent;
  let fixture: ComponentFixture<IngredientConversionFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [IngredientConversionFormComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientConversionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
