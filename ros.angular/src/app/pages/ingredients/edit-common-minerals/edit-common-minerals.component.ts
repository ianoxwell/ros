import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DecimalThreePlaces, DecimalTwoPlaces } from '@models/static-variables';
import { first, tap } from 'rxjs/operators';

@Component({
    selector: 'app-edit-common-minerals',
    templateUrl: './edit-common-minerals.component.html',
    styleUrls: ['./edit-common-minerals.component.scss'],
    standalone: false
})
export class EditCommonMineralsComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Output() markAsDirty = new EventEmitter<void>();

  decimalTwoPlaces = DecimalTwoPlaces;
  decimalThreePlaces = DecimalThreePlaces;

  ngOnInit() {
    this.listenAnyFormChanges();
  }

  // Mark the parent form as Dirty if any form element changes
  // only listens for the first change (because then it is dirty) - may have to reload on save...
  listenAnyFormChanges(): void {
    this.form.valueChanges
      .pipe(
        first(),
        tap(() => this.markAsDirty.emit())
      )
      .subscribe();
  }
}
