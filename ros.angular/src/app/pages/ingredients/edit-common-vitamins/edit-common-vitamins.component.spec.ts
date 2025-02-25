import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditCommonVitaminsComponent } from './edit-common-vitamins.component';

describe('EditCommonVitaminsComponent', () => {
  let component: EditCommonVitaminsComponent;
  let fixture: ComponentFixture<EditCommonVitaminsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EditCommonVitaminsComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommonVitaminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
