import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BaseTableComponent } from '@components/base/table.component.base';
import { IIngredient, IIngredientShort } from '@DomainModels/ingredient.dto';
import { PurchasedBy } from '@models/ingredient/ingredient.model';
import { AppStore } from 'src/app/app.store';

@Component({
  selector: 'app-ingredient-table',
  templateUrl: './ingredient-table.component.html',
  styleUrls: ['./ingredient-table.component.scss'],
  standalone: false
})
export class IngredientTableComponent extends BaseTableComponent<IIngredientShort> implements OnInit {
  @Output() editRow = new EventEmitter<IIngredient>();
  displayedColumns = ['name', 'aisle', 'carbs', 'fats', 'proteins'];
  purchasedBy = PurchasedBy;

  constructor() {
    super();
  }


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data.results);
  }

  /** on row / ingredient clicked emit to parent the row */
  goto(row: IIngredient) {
    this.editRow.emit(row);
  }
}
