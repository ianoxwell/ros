import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CPurchasedBy, IIngredient } from '@models/ingredient/ingredient.model';
import { IReferenceAll } from '@models/reference.model';
import { ValidationMessages } from '@models/static-variables';
import { DialogService } from '@services/dialog.service';
import { first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-ingredient-basic',
  templateUrl: './edit-ingredient-basic.component.html',
  styleUrls: ['./edit-ingredient-basic.component.scss']
})
export class EditIngredientBasicComponent {
  @Input() refData!: IReferenceAll;
  @Input() ingredientForm!: FormGroup;
  @Input() selectedIngredient: IIngredient | null = null;
  @Output() updatedIngredient = new EventEmitter<IIngredient>();
  validationMessages = ValidationMessages;
  purchasedByList = CPurchasedBy.map((item: string, id: number) => ({
    id,
    item
  }));

  constructor(private dialogService: DialogService) {}

  get nameControl(): FormControl {
    return this.ingredientForm.get('name') as FormControl;
  }
  get usdaFoodId(): FormControl {
    return this.ingredientForm.get('usdaFoodId') as FormControl;
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
