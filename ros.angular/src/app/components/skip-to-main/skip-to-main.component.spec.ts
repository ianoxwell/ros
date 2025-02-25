/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IDictionary } from '@core/common.model';
import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { SkipToMainComponent } from './skip-to-main.component';

describe('SkipToMainComponent', () => {
  let component: SkipToMainComponent;
  let fixture: ComponentFixture<SkipToMainComponent>;

  const HTMLElements: IDictionary<HTMLElement> = {};
  document.getElementById = jasmine.createSpy('HTML Element').and.callFake(function (id) {
    if (!HTMLElements[id]) {
      const newElement = document.createElement('div');
      HTMLElements[id] = newElement;
    }

    return HTMLElements[id];
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkipToMainComponent, MockPipe(TranslatePipe)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkipToMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
