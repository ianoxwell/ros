import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { IIngredient } from '@DomainModels/ingredient.dto';
import { CPurchasedBy } from '@models/ingredient/ingredient.model';
import { IReferenceAll } from '@models/reference.model';
import { ValidationMessages } from '@models/static-variables';
import { DialogService } from '@services/dialog.service';
import { first, tap } from 'rxjs/operators';

@Component({
    selector: 'app-edit-ingredient-basic',
    templateUrl: './edit-ingredient-basic.component.html',
    styleUrls: ['./edit-ingredient-basic.component.scss'],
    standalone: false
})
export class EditIngredientBasicComponent {
  @Input() refData!: IReferenceAll;
  @Input() ingredientForm!: UntypedFormGroup;
  @Input() selectedIngredient: IIngredient | null = null;
  @Output() updatedIngredient = new EventEmitter<IIngredient>();
  validationMessages = ValidationMessages;
  purchasedByList = CPurchasedBy.map((item: string, id: number) => ({
    id,
    item
  }));

  constructor(private dialogService: DialogService) {}

  get nameControl(): UntypedFormControl {
    return this.ingredientForm.get('name') as UntypedFormControl;
  }
  get usdaFoodId(): UntypedFormControl {
    return this.ingredientForm.get('usdaFoodId') as UntypedFormControl;
  }

  /** Fires a dialog to attempt to match and update ingredient from the rawUsdaFood database */
  matchUsda(): void {
    if (!this.refData.IngredientFoodGroup || !this.selectedIngredient) {
      return;
    }

    this.dialogService
      .matchIngredientDialog(this.selectedIngredient, this.refData.IngredientFoodGroup)
      .pipe(
        first(),
        tap((result: IIngredient) => this.updatedIngredient.emit(result))
      )
      .subscribe();
  }
}
