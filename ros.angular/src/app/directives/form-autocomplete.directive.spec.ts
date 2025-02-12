import { TestBed, async, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { FormAutocompleteDirective } from './form-autocomplete.directive';
import { Component, DebugElement } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';

@Component({
  template: ` <form class="test-form">
    <input matInput placeholder="testing" />
  </form>`
})
class TestHostComponent {}

describe('Directive: FormAutocomplete', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let formDebugElement: DebugElement;
  let formElement: HTMLFormElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MatInputModule],
        declarations: [TestHostComponent, FormAutocompleteDirective]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    formDebugElement = fixture.debugElement.query(By.css('.test-form'));
    formElement = formDebugElement.nativeElement as HTMLFormElement;
  });

  it('should add all attribute autocomplete set to off', () => {
    expect(formElement.getAttribute('autocomplete')).toEqual('off');
  });
});
