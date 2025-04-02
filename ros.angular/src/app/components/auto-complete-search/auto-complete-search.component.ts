/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function, @typescript-eslint/explicit-module-boundary-types */
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Optional,
  Output,
  Self,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ComponentBase } from '@components/base/base.component.base';
import { IReference } from '@DomainModels/reference.dto';
import { isObservable, Observable, of } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-auto-complete-search',
  templateUrl: './auto-complete-search.component.html',
  styleUrls: ['./auto-complete-search.component.scss'],
  imports: [CommonModule, MatAutocompleteModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule]
})
export class AutoCompleteSearchComponent
  extends ComponentBase
  implements ControlValueAccessor, AfterContentInit, OnChanges
{
  // Important inputs
  @Input() placeholder = '';
  @Input() matHint = '';

  // Function to format the display of the ref items.
  @Input() displayWith: (item: IReference) => string = (i: IReference) => i?.title;

  @Input() values: Observable<IReference[]> | IReference[] = [];
  @Output() filterChange = new EventEmitter<string>();

  // Gets a reference to the MatAutocompleteTrigger.
  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger, static: true }) auto!: MatAutocompleteTrigger;

  // custom error matcher to link the input to the error state of the control
  readonly errorStateMatcher: ErrorStateMatcher = {
    isErrorState: () => this.control && this.control.invalid && this.control.touched
  };

  // Copy of '@Input() values' guaranteed to be an actual observable (as opposed to the 'maybe observable maybe sync data' @Input() values)
  values$: Observable<IReference[]> = of([]);

  filterControl = new UntypedFormControl();
  control: UntypedFormControl = new UntypedFormControl();
  value: IReference | undefined;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    super();
    if (!!ngControl) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      ngControl.valueAccessor = this;
    }
  }

  ngAfterContentInit(): void {
    this.control = this.ngControl && (this.ngControl.control as UntypedFormControl);
    this.getWatchFilterText(this.filterControl.valueChanges).subscribe();
    this.resetFilterValue(this.control.valueChanges).subscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    const values = changes.values;
    if (values && values.currentValue !== values.previousValue) {
      this.values$ = isObservable(this.values) ? this.values : of(this.values);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  writeValue(value: IReference): void {
    this.value = value;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.filterControl.disable();
    } else {
      this.filterControl.enable();
    }
  }

  onBlur(): void {
    // When the user blurs our of the control we need to ensure that the filterControl holds the currently selected text.
    // The set timeout ensures that the users 'click' event to select a new ref item goes through first.
    // Otherwise the filter will have updated by the time the autocomplete goes to check the item,
    // and we'll lose the selected item.

    // commented out for now
    console.log('auto-complete blur', this.filterControl.value);
    // setTimeout(() => {
    // 	// If the user clears out the filter, and there is an existing value, we clear the value.
    // 	if (!this.filterControl.value?.length && this.value) {
    // 		this.value = null;
    // 	}
    // 	this.resetFilterControlValue(this.value);
    // }, 500);
    // this.onTouched();
  }

  // Watches for changes to the filter text and emits.
  getWatchFilterText(filterValue$: Observable<string>): Observable<any> {
    return filterValue$.pipe(
      filter((filterValue) => typeof filterValue === 'string'), // There's a tendency for the autocomplete to shove ref items down the pipe...
      tap((filterValue) => this.filterChange.emit(filterValue)),
      takeUntil(this.ngUnsubscribe)
    );
  }

  // Resets the filter text when the selected object changes.
  resetFilterValue(value$: Observable<IReference>): Observable<any> {
    const result$ = value$.pipe(
      tap((item) => this.resetFilterControlValue(item)),
      takeUntil(this.ngUnsubscribe)
    );

    return result$;
  }

  onSelect(value: IReference): void {
    this.value = value;
    // this.control.setValue(value);
    // this.control.markAsDirty();
  }

  /* Makes the autocomplete options list appear when the user clicks on the input field.
   * By default the options only appear when the input gains focus, so the user
   * would have to click outside the input and then click back into the input.
   */
  onInputClick(): void {
    if (!this.auto.panelOpen) {
      this.filterChange.emit(this.filterControl.value);
      this.auto.openPanel();
    }
  }

  private resetFilterControlValue(item: IReference): void {
    const text = this.displayWith(item) ?? '';
    this.filterControl.setValue(text);
  }
}
