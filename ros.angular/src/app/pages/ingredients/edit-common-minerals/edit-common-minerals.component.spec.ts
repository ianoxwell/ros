import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommonMineralsComponent } from './edit-common-minerals.component';

describe('EditCommonMineralsComponent', () => {
  let component: EditCommonMineralsComponent;
  let fixture: ComponentFixture<EditCommonMineralsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EditCommonMineralsComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommonMineralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
