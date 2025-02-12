import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientPricesFormComponent } from './ingredient-prices-form.component';

describe('IngredientPricesFormComponent', () => {
  let component: IngredientPricesFormComponent;
  let fixture: ComponentFixture<IngredientPricesFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [IngredientPricesFormComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientPricesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
