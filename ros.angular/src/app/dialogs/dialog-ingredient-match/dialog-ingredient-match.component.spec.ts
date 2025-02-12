import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DialogIngredientMatchComponent } from './dialog-ingredient-match.component';

describe('DialogIngredientMatchComponent', () => {
  let component: DialogIngredientMatchComponent;
  let fixture: ComponentFixture<DialogIngredientMatchComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DialogIngredientMatchComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogIngredientMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
