import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteIngredientComponent } from './dialog-delete-ingredient.component';

describe('DialogDeleteIngredientComponent', () => {
  let component: DialogDeleteIngredientComponent;
  let fixture: ComponentFixture<DialogDeleteIngredientComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DialogDeleteIngredientComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
