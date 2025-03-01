import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ComponentBase } from '@components/base/base.component.base';
import { EOrder } from '@DomainModels/base.dto';
import { CBlankFilter, IFilter } from '@DomainModels/filter.dto';
import { IIngredientFilterObject, IngredientFilterObject } from '@models/filter-queries.model';
import { IReferenceAll } from '@models/reference.model';
import { StateService } from '@services/state.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { debounceTime, map, take, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ingredient-filter',
  templateUrl: './ingredient-filter.component.html',
  styleUrls: ['./ingredient-filter.component.scss'],
  standalone: false
})
export class IngredientFilterComponent extends ComponentBase implements OnInit {
  searchForm: UntypedFormGroup = new UntypedFormGroup({});
  @Input() refData: IReferenceAll = {};
  filterQuery: IFilter = { ...CBlankFilter, take: 25 };
  isFormReady$: Observable<boolean> = of(false);

  constructor(
    private fb: UntypedFormBuilder,
    private stateService: StateService
  ) {
    super();
  }

  async ngOnInit() {
    this.searchForm = this.createForm(this.filterQuery);
    this.listenFormChanges().subscribe();
  }

  /**
   * Listens for form changes and sets the stateService ingredientFilter object appropriately, disposed of with the component
   */
  listenFormChanges() {
    return this.searchForm.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
        this.filterQuery = {
          ...this.filterQuery,
          ...this.searchForm.getRawValue()
        };
        this.stateService.setIngredientFilterQuery(this.filterQuery);
      }),
      takeUntil(this.ngUnsubscribe)
    );
  }

  /**
   * Creates the form after the stateService IngredientFilterQuery returns.
   * @returns FormGroup for searchForm.
   */
  createForm(existingForm: IFilter): UntypedFormGroup {
    return this.fb.group({
      keyword: existingForm.keyword || '',

      order: existingForm.order || EOrder.ASC,
      sort: existingForm.sort || 'name',
      take: existingForm.take || environment.resultsPerPage * 2,
      page: existingForm.page || 0
      // name: this.filterQuery.name,
      // type: this.filterQuery.type,
      // parent: this.filterQuery.parent,
      // allergies: this.filterQuery.allergies,
      // purchasedBy: this.filterQuery.purchasedBy,
      // isUsdaFoodIdNull: this.filterQuery.isUsdaFoodIdNull
    });
  }

  /**
   * Called from the template, resets the form and sets the ingredientFilter state.
   */
  clearFilterTerms(): void {
    this.searchForm = this.createForm(CBlankFilter);
    this.stateService.setIngredientFilterQuery(CBlankFilter);
  }
}
