import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { IMeasurement } from '@models/ingredient/ingredient-model';
import { IReferenceItemFull } from '@models/reference.model';

@Component({
    selector: 'app-ingredient-conversion-form',
    templateUrl: './ingredient-conversion-form.component.html',
    styleUrls: ['./ingredient-conversion-form.component.scss'],
    standalone: false
})
export class IngredientConversionFormComponent {
  @Input() convert: UntypedFormGroup = new UntypedFormGroup({});
  @Input() ingredientState: IReferenceItemFull[] = [];
  @Input() measurements: IMeasurement[] = [];
  @Output() markAsDirty = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<void>();
}
