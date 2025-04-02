import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BaseTableComponent } from '@components/base/table.component.base';
import { IIngredientFilter } from '@DomainModels/filter.dto';
import { IIngredient, IIngredientShort } from '@DomainModels/ingredient.dto';

@Component({
  selector: 'app-ingredient-table',
  templateUrl: './ingredient-table.component.html',
  styleUrls: ['./ingredient-table.component.scss'],
  standalone: false
})
export class IngredientTableComponent
  extends BaseTableComponent<IIngredientShort, IIngredientFilter>
  implements OnInit
{
  @Output() editRow = new EventEmitter<IIngredient>();
  displayedColumns = ['name', 'aisle', 'carbs', 'fats', 'proteins'];

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
