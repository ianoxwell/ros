/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReferenceService } from '@services/reference.service';
import { autoSpy, Spy } from '@tests/auto-spy';
import { of } from 'rxjs';
import { AutoCompleteSearchComponent } from './auto-complete-search.component';

describe('AutoCompleteSearchComponent', () => {
  let component: AutoCompleteSearchComponent;
  let fixture: ComponentFixture<AutoCompleteSearchComponent>;

  // let formLinkServiceSpy: Spy<FormLinkService>;
  let referenceServiceSpy: Spy<ReferenceService>;

  beforeEach(
    waitForAsync(() => {
      referenceServiceSpy = autoSpy(ReferenceService);

      TestBed.configureTestingModule({
        imports: [MatInputModule, MatAutocompleteModule, NoopAnimationsModule],
        declarations: [AutoCompleteSearchComponent],
        providers: [{ provide: ReferenceService, useValue: referenceServiceSpy }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteSearchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('resetFilterValue', () => {
    it('should set the filter control to the item title', (done) => {
      component.resetFilterValue(of({ title: 'test-title' } as any)).subscribe(() => {
        expect(component.filterControl.value).toEqual('test-title');

        done();
      });
    });
    it("should set the filter control to '' if there is no item", (done) => {
      component.resetFilterValue(of(null)).subscribe(() => {
        expect(component.filterControl.value).toEqual('');

        done();
      });
    });
  });

  describe('errorStateMatcher', () => {
    beforeEach(() => {
      component.control = new FormControl();
    });
    it('should not report errors for valid controls', () => {
      component.control.markAsTouched();
      component.control.setErrors(null);
      const isError = component.errorStateMatcher.isErrorState(null, null);
      expect(isError).toBeFalsy();
    });
    it('should not report errors for untouched controls', () => {
      component.control.setErrors({});
      const isError = component.errorStateMatcher.isErrorState(null, null);
      expect(isError).toBeFalsy();
    });
    it('should report errors for invalid touched controls', () => {
      component.control.markAsTouched();
      component.control.setErrors({});
      const isError = component.errorStateMatcher.isErrorState(null, null);
      expect(isError).toBeTruthy();
    });
  });

  xdescribe('onBlur', () => {
    it('should snap back to the selected value', fakeAsync(() => {
      component.value = { id: 5, title: 'ref-5' };
      component.filterControl.setValue('asdf');

      component.onBlur();

      tick(1000);

      expect(component.filterControl.value).toBe('ref-5');
    }));
    it('should clear the control if empty', fakeAsync(() => {
      component.value = { id: 5, title: 'ref-5' };
      component.filterControl.setValue('');

      component.onBlur();

      tick(1000);

      expect(component.filterControl.value).toBeFalsy();
    }));
  });

  describe('onSelect', () => {
    it('should trigger on-change callbacks', () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      component.onSelect({ id: 5, title: 'ref-5' });

      expect(onChange).toHaveBeenCalledWith({ id: 5, title: 'ref-5' });
      expect(component.value).toEqual({ id: 5, title: 'ref-5' });
    });
  });

  describe('watchFilterText', () => {
    let filterChange: any;

    beforeEach(() => {
      filterChange = jasmine.createSpyObj('EventEmitter', ['emit']);
      component.filterChange = filterChange;
    });

    it('should not emit null', (done) => {
      const value = of(null);
      component.getWatchFilterText(value).subscribe(
        () => fail(),
        () => {},
        () => {
          expect(filterChange.emit).not.toHaveBeenCalled();
          done();
        }
      );
    });
    it('should not emit objects', (done) => {
      const value = of({}) as any;
      component.getWatchFilterText(value).subscribe(
        () => fail(),
        () => {},
        () => {
          expect(filterChange.emit).not.toHaveBeenCalled();
          done();
        }
      );
    });
    it('should emit text', (done) => {
      const value = of('');
      component.getWatchFilterText(value).subscribe(() => {
        expect(filterChange.emit).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('values$', () => {
    it('should be the input values if values is an observable', (done) => {
      const values$ = of([{ title: 'a' }, { title: 'b' }] as any[]);
      component.values = values$;
      component.control = new FormControl();

      component.ngOnChanges({
        values: { currentValue: values$, previousValue: null, isFirstChange: () => false, firstChange: false }
      });

      component.values$.subscribe((data) => {
        expect(data).toEqual([{ title: 'a' }, { title: 'b' }] as any[]);
        done();
      });
    });
    it('should convert the input values to an observable', (done) => {
      const values = [{ title: 'a' }, { title: 'b' }] as any[];
      component.values = values;
      component.control = new FormControl();

      component.ngOnChanges({
        values: { currentValue: values, previousValue: null, isFirstChange: () => false, firstChange: false }
      });

      component.values$.subscribe((data) => {
        expect(data).toEqual([{ title: 'a' }, { title: 'b' }] as any[]);
        done();
      });
    });
  });
});
