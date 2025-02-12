import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditIngredientBasicComponent } from './edit-ingredient-basic.component';

describe('EditIngredientBasicComponent', () => {
  let component: EditIngredientBasicComponent;
  let fixture: ComponentFixture<EditIngredientBasicComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EditIngredientBasicComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIngredientBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
