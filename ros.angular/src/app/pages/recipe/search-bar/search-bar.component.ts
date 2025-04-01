import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ComponentBase } from '@components/base/base.component.base';
import { EOrder } from '@DomainModels/base.dto';
import { CBlankFilter, IFilter } from '@DomainModels/filter.dto';
import { IAllReferences } from '@DomainModels/reference.dto';
import { OrderRecipesBy } from '@models/static-variables';
import { StateService } from '@services/state.service';
import { firstValueFrom } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { AppStore } from 'src/app/app.store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: false
})
export class SearchBarComponent extends ComponentBase implements OnInit {
  searchForm: UntypedFormGroup | undefined;
  filterQuery: IFilter = CBlankFilter;
  @Input() dataLength = 0;
  orderRecipesBy = OrderRecipesBy;
  references: IAllReferences | undefined;

  constructor(
    private fb: UntypedFormBuilder,
    private stateService: StateService,
    private appStore: AppStore
  ) {
    super();

    this.references = this.appStore.$references();
  }

  async ngOnInit() {
    const getExistingForm = await firstValueFrom(this.stateService.getRecipeFilterQuery());
    this.searchForm = this.createForm(getExistingForm);
    this.listenToFormChanges();
  }

  /**
   * Listens to form changes to trigger changes in the recipe Filter State, debounced for keystrokes.
   */
  listenToFormChanges(): void {
    this.searchForm?.valueChanges
      .pipe(
        debounceTime(500),
        tap((values: IFilter) => this.changeRecipeFilterState(values)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  /**
   * Updates the filterQuery along with the recipeFilterQuery in stateService.
   * @param values from the form change.
   */
  changeRecipeFilterState(values: IFilter): void {
    this.filterQuery = values;
    this.filterQuery.page = 0;
    this.stateService.setRecipeFilterQuery(this.filterQuery);
  }




  /**
   * Patches the form with external values.
   * @param item Any external values to hydrate the form.
   */
  patchForm(item: IFilter) {
    if (!item) {
      item = CBlankFilter;
    }

    if (!this.searchForm) {
      this.searchForm = this.createForm(CBlankFilter);
    }

    this.searchForm.patchValue({
      ...item
      // keyword: item.keyword,
      // ingredient: item.ingredient,
      // author: item.author,
      // totalTime: item.totalTime,
      // servingPrice: item.servingPrice, // search priceServing {$le: servingTime}
      // recipeCreated: item.recipeCreated, // date number greater than the number set ie today - 7 days
      // equipment: item.equipment, // {favouriteFoods: {"$in": ["sushi", "hotdog"]}}
      // recipeType: item.recipeType,
      // healthLabels: item.healthLabels,
      // cuisineType: item.cuisineType,
      // allergyWarning: item.allergyWarning, // { "allergyWarnings": { "$not": { "$all": [allergyWarning] } } }
      // orderby: item.orderby || 'name',
      // perPage: item.perPage || 10,
      // page: item.page || 0
    });
  }

  get totalTime(): UntypedFormControl {
    return this.searchForm?.get('totalTime') as UntypedFormControl;
  }
  get servingPrice(): UntypedFormControl {
    return this.searchForm?.get('servingPrice') as UntypedFormControl;
  }

  /**
   * Creates the initial form with blank values.
   * @returns the initial blank form.
   */
  createForm(existingForm: IFilter): UntypedFormGroup {
    return this.fb.group({
      keyword: existingForm.keyword || '',
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
      order: existingForm.order || EOrder.ASC,
      sort: existingForm.sort || 'name',
      take: existingForm.take || environment.resultsPerPage,
      page: existingForm.page || 0
    });
  }

  /**
   * Triggered from the template - clears out the filter terms and resets the form.
   */
  clearFilterTerms(): void {
    this.searchForm = this.createForm(CBlankFilter);
    this.filterQuery = CBlankFilter;
    this.stateService.setRecipeFilterQuery(this.filterQuery);
  }
}
