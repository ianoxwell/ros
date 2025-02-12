import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@components/shared-component.module';
import { CompleteMaterialModule } from '../app-material.module';
import { ConfirmDialogComponent } from './dialog-confirm/confirm.component';
import { DialogDeleteIngredientComponent } from './dialog-delete-ingredient/dialog-delete-ingredient.component';
import { DialogErrorComponent } from './dialog-error/dialog-error.component';
import { DialogIngredientMatchComponent } from './dialog-ingredient-match/dialog-ingredient-match.component';
import { DialogNewIngredientComponent } from './dialog-new-ingredient/dialog-new-ingredient.component';
import { DialogRecipeComponent } from './dialog-recipe/dialog-recipe.component';

@NgModule({
  imports: [
    CompleteMaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedComponentModule
  ],
  declarations: [
    DialogErrorComponent,
    DialogDeleteIngredientComponent,
    DialogRecipeComponent,
    DialogNewIngredientComponent,
    ConfirmDialogComponent,
    DialogIngredientMatchComponent
  ],
  exports: [
    DialogErrorComponent,
    DialogDeleteIngredientComponent,
    DialogRecipeComponent,
    DialogNewIngredientComponent,
    ConfirmDialogComponent,
    DialogIngredientMatchComponent
  ],
  providers: []
})
export class DialogModule {}
