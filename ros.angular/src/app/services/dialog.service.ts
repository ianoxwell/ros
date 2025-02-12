import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentBase } from '@components/base/base.component.base';
import { IIngredient } from '@models/ingredient/ingredient.model';
import { IMeasurement } from '@models/ingredient/ingredient-model';
import { MessageStatus } from '@models/message.model';
import { IReferenceItemFull } from '@models/reference.model';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../dialogs/dialog-confirm/confirm.component';
import { DialogIngredientMatchComponent } from '../dialogs/dialog-ingredient-match/dialog-ingredient-match.component';
import { DialogNewIngredientComponent } from '../dialogs/dialog-new-ingredient/dialog-new-ingredient.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService extends ComponentBase {
  constructor(private dialog: MatDialog, private matSnackBar: MatSnackBar) {
    super();
  }

  /** Opens Material UI dialog boxes with given parameters */
  createDialog<T>(data: any, component: any, width = '60%'): Observable<T> {
    const dialogRef = this.dialog.open(component, {
      width,
      data,
      position: { top: '50px' }
    });

    return dialogRef.afterClosed();
  }

  /** Opens a confirm dialog */
  confirm(status: MessageStatus, title: string, message: string, buttonText = 'Confirm'): Observable<boolean> {
    const data = { status, title, message, buttonText };
    return this.createDialog<boolean>(data, ConfirmDialogComponent);
  }

  /** Opens an alert dialog */
  alert(heading: string, err: any, confirmButton = 'Okay'): Observable<void> {
    // if error message if of type HttpErrorResponse then it will have a message
    const message = !!err.message ? err.message : err;
    const data = { status: MessageStatus.Error, heading, message, confirmButton };
    return this.createDialog<void>(data, ConfirmDialogComponent);
  }

  /**
   * Opens a new Ingredient Dialog
   * @param foodGroup Reference data for the food Groups.
   * @param measurements Reference Data for measurements (used in conversions).
   * @param ingredientStateRef Reference Data for the ingredient States (i.e. solid, liquid)
   * @returns Observable of the new ingredient
   */
  newIngredientDialog(
    foodGroup: IReferenceItemFull[],
    measurements: IMeasurement[],
    ingredientStateRef: IReferenceItemFull[]
  ): Observable<IIngredient> {
    return this.createDialog<IIngredient>(
      { foodGroup, measurements, ingredientStateRef },
      DialogNewIngredientComponent
    );
  }

  /**
   * Opens a dialog to match the ingredients with the Usda Food id and populate the nutrients / vitamins / minerals.
   * @param ingredient The ingredient to edit.
   * @param foodGroup The refData for FoodGroup to match with.
   * @returns Observable of the updated ingredient
   */
  matchIngredientDialog(ingredient: IIngredient, foodGroup: IReferenceItemFull[]): Observable<IIngredient> {
    return this.createDialog<IIngredient>({ ingredient, foodGroup }, DialogIngredientMatchComponent);
  }

  /** Closes all dialogs */
  closeAll() {
    this.dialog.closeAll();
  }

  /** Opens a snackbar */
  snackBar(status: MessageStatus, message: string, durationTime = 3000) {
    this.matSnackBar.open(message, 'X', {
      duration: durationTime,
      verticalPosition: 'top',
      panelClass: [status]
    });
  }
}
