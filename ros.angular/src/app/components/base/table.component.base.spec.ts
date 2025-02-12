import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSort } from '@angular/material/sort';
import { ISortPageObj } from '@models/common.model';
import { BaseTableComponent } from './table.component.base';

// must mock the abstract class to a concrete class
class MockTableComponentBase extends BaseTableComponent {
  goto(): void {
    return;
  }
}

describe('TableComponentBase', () => {
  let component: BaseTableComponent;
  let fixture: ComponentFixture<BaseTableComponent>;

  const fakeEmptyFilterParams: ISortPageObj = {
    orderby: 'id',
    order: 'asc',
    page: 0,
    perPage: 25
  };
  const fakeSortFilterParams: ISortPageObj = {
    orderby: 'name',
    order: 'desc',
    page: 0,
    perPage: 25
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BaseTableComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MockTableComponentBase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Pagination change event', () => {
    beforeEach(() => {
      component.sortPageObj = { ...fakeEmptyFilterParams };
    });
    it('should reset the pageIndex if the pageSize has changed', () => {
      component.sortPageObj.page = 2;
      expect(component.sortPageObj.perPage).toEqual(25);

      component.onPageChange({ pageSize: 15, pageIndex: 2, previousPageIndex: 2, length: 25 });
      expect(component.sortPageObj.page).toEqual(0);
      expect(component.sortPageObj.perPage).toEqual(15);
    });
    it('should change the pageIndex on increment of page', () => {
      expect(component.sortPageObj.page).toEqual(0);

      component.onPageChange({ pageSize: 25, pageIndex: 1, previousPageIndex: 0, length: 25 });
      expect(component.sortPageObj.page).toEqual(1);
    });
  });

  it('should modify the filterParams and search on a sorting change', () => {
    component.sortPageObj = fakeEmptyFilterParams;
    component.sortPageObj.page = 2;

    component.onSortChange({ active: 'name', direction: 'desc' } as MatSort);
    expect(component.sortPageObj).toEqual(fakeSortFilterParams);
  });
});
