import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditIngredientNutritionComponent } from './edit-ingredient-nutrition.component';

describe('EditIngredientNutritionComponent', () => {
  let component: EditIngredientNutritionComponent;
  let fixture: ComponentFixture<EditIngredientNutritionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EditIngredientNutritionComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIngredientNutritionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
