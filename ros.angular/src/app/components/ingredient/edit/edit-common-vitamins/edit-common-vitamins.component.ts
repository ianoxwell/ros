import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DecimalThreePlaces, DecimalTwoPlaces } from '@models/static-variables';
import { first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-common-vitamins',
  templateUrl: './edit-common-vitamins.component.html',
  styleUrls: ['./edit-common-vitamins.component.scss']
})
export class EditCommonVitaminsComponent implements OnInit {
  @Input() form!: FormGroup;
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
