import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { IMeasurement } from '@models/ingredient/ingredient-model';
import { DecimalTwoPlaces } from '@models/static-variables';

@Component({
    selector: 'app-ingredient-prices-form',
    templateUrl: './ingredient-prices-form.component.html',
    styleUrls: ['./ingredient-prices-form.component.scss'],
    standalone: false
})
export class IngredientPricesFormComponent {
  @Input() price: UntypedFormGroup = new UntypedFormGroup({});
  @Input() measurements: IMeasurement[] = [];
  @Output() markAsDirty = new EventEmitter<void>();

  decimalTwoPlaces = DecimalTwoPlaces;
}
