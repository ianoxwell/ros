import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-delete-ingredient',
  templateUrl: './dialog-delete-ingredient.component.html',
  styleUrls: ['./dialog-delete-ingredient.component.scss']
})
export class DialogDeleteIngredientComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
