import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { SaveButtonComponent } from '@components/save-button/save-button.component';
import { ConfirmDialogComponent } from './dialog-confirm/confirm.component';
import { DialogDeleteIngredientComponent } from './dialog-delete-ingredient/dialog-delete-ingredient.component';
import { DialogErrorComponent } from './dialog-error/dialog-error.component';
import { DialogRecipeComponent } from './dialog-recipe/dialog-recipe.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    ReactiveFormsModule,
    SaveButtonComponent,
  ],
  declarations: [
    DialogErrorComponent,
    DialogDeleteIngredientComponent,
    DialogRecipeComponent,
    ConfirmDialogComponent,
  ],
  exports: [
    DialogErrorComponent,
    DialogDeleteIngredientComponent,
    DialogRecipeComponent,
    ConfirmDialogComponent,
  ],
  providers: []
})
export class DialogModule {}
