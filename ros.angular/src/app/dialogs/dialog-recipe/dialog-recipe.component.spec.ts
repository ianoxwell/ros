import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRecipeComponent } from './dialog-recipe.component';

describe('DialogRecipeComponent', () => {
  let component: DialogRecipeComponent;
  let fixture: ComponentFixture<DialogRecipeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DialogRecipeComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
