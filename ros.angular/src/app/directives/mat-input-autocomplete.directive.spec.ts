import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { MatInputAutoCompleteDirective } from './mat-input-autocomplete.directive';

@Component({
  template: ` <form>
    <input matInput placeholder="testing" />
  </form>`
})
class TestHostComponent {}

describe('Directive: MatInput', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let inputDebugElement: DebugElement;
  let inputElement: HTMLInputElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MatInputModule],
        declarations: [TestHostComponent, MatInputAutoCompleteDirective]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    inputDebugElement = fixture.debugElement.query(By.css('.mat-input-element'));
    inputElement = inputDebugElement.nativeElement as HTMLInputElement;
  });

  it('should add all three attributes to MatInput', () => {
    expect(inputElement.getAttribute('autocomplete')).toEqual('off');
    expect(inputElement.getAttribute('autocorrect')).toEqual('off');
    expect(inputElement.getAttribute('autocapitalize')).toEqual('none');
  });
});
