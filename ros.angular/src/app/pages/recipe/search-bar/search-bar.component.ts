import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ComponentBase } from '@components/base/base.component.base';
import { EOrder } from '@DomainModels/base.dto';
import { CBlankFilter, IRecipeFilter } from '@DomainModels/filter.dto';
import { TypedControls } from '@models/common.model';
import { AppStore } from 'src/app/app.store';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: false
})
export class SearchBarComponent extends ComponentBase implements OnInit {
  searchForm: FormGroup<TypedControls<Partial<IRecipeFilter>>> | undefined;
  eOrder = EOrder;

  sortBy = [
    { value: 'name', label: 'Name' },
    { value: 'readyInMinutes', label: 'Cooking Time' },
    { value: 'healthScore', label: 'Health rating' },
    { value: 'servings', label: 'Servings' }
  ];

  constructor(public appStore: AppStore) {
    super();
  }

  async ngOnInit() {
    this.searchForm = this.createForm();
  }

  get searchOrder(): FormControl<EOrder> {
    return this.searchForm?.get('order') as FormControl<EOrder>;
  }

  applyFilter(): void {
    const rawForm = this.searchForm?.getRawValue();
    this.appStore.setRecipeFilter({ ...this.appStore.$recipeFilter(), ...rawForm });
  }

  /**
   * Creates the initial form with blank values.
   * @returns the initial blank form.
   */
  createForm(): FormGroup<TypedControls<Partial<IRecipeFilter>>> {
    const existingForm = this.appStore.$recipeFilter();
    const form = new FormGroup<TypedControls<Partial<IRecipeFilter>>>({
      keyword: new FormControl<string>(existingForm.keyword || '', { nonNullable: true }),
      order: new FormControl<EOrder>(existingForm.order || EOrder.ASC, { nonNullable: true }),
      sort: new FormControl<string>(existingForm.sort || 'name', { nonNullable: true })
    });

    return form;
  }

  toggleSortOrder() {
    if (!this.searchForm) {
      return;
    }

    const currentOrder = this.searchOrder.getRawValue();
    this.searchOrder.patchValue(currentOrder === EOrder.ASC ? EOrder.DESC : EOrder.ASC);
  }

  // ingredient: '',
  // author: '',
  // totalTime: 0,
  // servingPrice: 0, // search priceServing {$le: servingTime}
  // recipeCreated: 0, // date number greater than the number set ie today - 7 days
  // equipment: [], // {favouriteFoods: {"$in": ["sushi", "hotdog"]}}
  // recipeType: [],
  // healthLabels: [],
  // cuisineType: [],
  // allergyWarning: [], // { "allergyWarnings": { "$not": { "$all": [allergyWarning] } } }

  /**
   * Triggered from the template - clears out the filter terms and resets the form.
   */
  clearFilterTerms(): void {
    this.appStore.setRecipeFilter(CBlankFilter);
    this.searchForm = this.createForm();
  }
}
