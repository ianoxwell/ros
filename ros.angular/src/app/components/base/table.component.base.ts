import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ISortPageObj, PagedResult, SortPageObj } from '@models/common.model';

@Component({ template: '' })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseTableComponent<T = any> implements OnChanges {
  @Input() data: PagedResult<T> = { items: [], totalCount: 0 };
  @Input() sortPageObj: ISortPageObj = new SortPageObj();
  @Output() sortingPageChange = new EventEmitter<ISortPageObj>();
  @Output() updateTableRequest = new EventEmitter();

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<T> = new MatTableDataSource();
  dataLength = 0;
  dataCount = 0;

  ngOnChanges(change: SimpleChanges): void {
    if (!!change.data && !change.data.firstChange) {
      const data: PagedResult<T> = change.data.currentValue;
      this.dataSource.data = data.items;
      this.dataCount = data.items.length;
      this.dataLength = data.totalCount;
    }
  }
  /** This MUST be implemented in the extending class */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract goto(row: any): void;

  /** Triggers when there is a sorting change in the template, resets page */
  onSortChange(ev: Sort): void {
    this.sortPageObj.orderby = ev.active;
    this.sortPageObj.order = ev.direction;
    this.sortPageObj.page = 0;
    this.sortingPageChange.emit(this.sortPageObj);
  }

  /** Triggers from the paginator, resets page when perPage Changes */
  onPageChange(pageEvent: PageEvent): void {
    if (pageEvent.pageSize !== this.sortPageObj.perPage) {
      this.sortPageObj.page = 0;
      this.sortPageObj.perPage = pageEvent.pageSize;
    } else {
      this.sortPageObj.page = pageEvent.pageIndex;
    }
    this.sortingPageChange.emit(this.sortPageObj);
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
