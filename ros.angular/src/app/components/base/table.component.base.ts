import { Component, EventEmitter, input, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EOrder, IPagedResult } from '@DomainModels/base.dto';
import { CBlankFilter, IFilter, IIngredientFilter } from '@DomainModels/filter.dto';

@Component({
  template: '',
  standalone: false
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseTableComponent<T = any, F = IFilter | IIngredientFilter> implements OnChanges {
  @Input({ required: true }) data!: IPagedResult<T>;
  filter = input<F>({ ...CBlankFilter, take: 25 } as F);
  @Output() sortingPageChange = new EventEmitter<F>();

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<T> = new MatTableDataSource();
  sortDirection: SortDirection = EOrder.ASC.toLowerCase() as SortDirection;

  ngOnChanges(change: SimpleChanges): void {
    if (!!change.data && !change.data.firstChange) {
      const data: IPagedResult<T> = change.data.currentValue;
      this.dataSource.data = data.results;
    }
  }
  /** This MUST be implemented in the extending class */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract goto(row: any): void;

  /** Triggers when there is a sorting change in the template, resets page */
  onSortChange(ev: Sort): void {
    const sort = ev.active === 'carbs' ? 'percentCarbs' : ev.active === 'fats' ? 'percentFat' : 'percentProtein';
    const tempFilter = {
      ...this.filter(),
      sort,
      order: ev.direction.toUpperCase() as EOrder,
      page: 0
    } as F;

    this.sortDirection = ev.direction.toLowerCase() as SortDirection;

    this.sortingPageChange.emit(tempFilter);
  }

  /** Triggers from the paginator, resets page when perPage Changes */
  onPageChange(pageEvent: PageEvent): void {
    const tempFilter = {
      ...this.filter(),
      page: pageEvent.pageIndex
    } as F;

    this.sortingPageChange.emit(tempFilter);
  }

  /** Sets boolean for mouseRow for the row, for css class rollover effect */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mouseRow(row: any, inOut: string): void {
    if (inOut === 'over') {
      row.mouseRow = true;
    } else {
      row.mouseRow = null;
    }
  }
}
