import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientViewComponent } from './ingredient-view.component';

describe('IngredientViewComponent', () => {
  let component: IngredientViewComponent;
  let fixture: ComponentFixture<IngredientViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IngredientViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
