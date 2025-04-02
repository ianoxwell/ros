import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { EOrder } from '@DomainModels/base.dto';
import { CBlankFilter } from '@DomainModels/filter.dto';
import { AppStore } from 'src/app/app.store';

@Component({
  selector: 'app-ingredient-filter',
  templateUrl: './ingredient-filter.component.html',
  styleUrls: ['./ingredient-filter.component.scss'],
  standalone: false
})
export class IngredientFilterComponent {
  searchForm: UntypedFormGroup = new UntypedFormGroup({});

  constructor(
    private fb: UntypedFormBuilder,
    private appStore: AppStore
  ) {
    this.searchForm = this.createForm();
  }

  /**
   * Listens for form changes and sets the stateService ingredientFilter object appropriately, disposed of with the component
   */
  applyFilterTerms() {
    const formValue = this.searchForm.getRawValue();
    this.appStore.setIngredientFilter({ ...this.appStore.$ingredientFilter(), keyword: formValue.keyword || '' });
  }

  /**
   * Creates the form after the stateService IngredientFilterQuery returns.
   * @returns FormGroup for searchForm.
   */
  createForm(): UntypedFormGroup {
    const existingForm = this.appStore.$ingredientFilter();
    return this.fb.group({
      keyword: existingForm.keyword || '',

      order: existingForm.order || EOrder.ASC,
      sort: existingForm.sort || 'name'
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
    this.appStore.setIngredientFilter({ ...CBlankFilter, take: 25 });
    this.searchForm = this.createForm();
  }
}
