import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EOrder, IPagedResult } from '@DomainModels/base.dto';
import { CBlankFilter, IFilter } from '@DomainModels/filter.dto';

@Component({
  template: '',
  standalone: false
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseTableComponent<T = any> implements OnChanges {
  @Input({ required: true }) data!: IPagedResult<T>;
  @Input({ required: true }) filter: IFilter = CBlankFilter;
  @Output() sortingPageChange = new EventEmitter<IFilter>();
  @Output() updateTableRequest = new EventEmitter();

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
    this.filter.sort = ev.active;
    this.filter.order = ev.direction.toUpperCase() as EOrder;
    this.filter.page = 0;
    this.sortDirection = ev.direction.toLowerCase() as SortDirection;

    this.sortingPageChange.emit(this.filter);
  }

  /** Triggers from the paginator, resets page when perPage Changes */
  onPageChange(pageEvent: PageEvent): void {
    if (pageEvent.pageSize !== this.filter.take) {
      this.filter.page = 0;
      this.filter.take = pageEvent.pageSize;
    } else {
      this.filter.page = pageEvent.pageIndex;
    }
    this.sortingPageChange.emit(this.filter);
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
