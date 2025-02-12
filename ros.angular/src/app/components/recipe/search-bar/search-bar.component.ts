import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ComponentBase } from '@components/base/base.component.base';
import { IRecipeFilterQuery, RecipeFilterQuery } from '@models/filter-queries.model';
import { IReferenceAll, IReferenceItemFull } from '@models/reference.model';
import { OrderRecipesBy } from '@models/static-variables';
import { ReferenceService } from '@services/reference.service';
import { StateService } from '@services/state.service';
import { Observable } from 'rxjs';
import { debounceTime, map, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent extends ComponentBase implements OnInit, OnChanges {
  searchForm: FormGroup;
  @Input() filterQuery: IRecipeFilterQuery = new RecipeFilterQuery();
  @Input() dataLength = 0;
  orderRecipesBy = OrderRecipesBy;
  allergyArray$: Observable<IReferenceItemFull[]>;

  constructor(private fb: FormBuilder, private referenceService: ReferenceService, private stateService: StateService) {
    super();
    this.searchForm = this.createForm();
    this.allergyArray$ = this.referenceService.getAllReferences().pipe(
      map((allRef: IReferenceAll) => {
        return allRef.AllergyWarning || [];
      })
    );
  }

  ngOnInit(): void {
    this.listenToFormChanges();
  }

  /**
   * Listens to form changes to trigger changes in the recipe Filter State, debounced for keystrokes.
   */
  listenToFormChanges(): void {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        tap((values: RecipeFilterQuery) => this.changeRecipeFilterState(values)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  /**
   * Updates the filterQuery along with the recipeFilterQuery in stateService.
   * @param values from the form change.
   */
  changeRecipeFilterState(values: RecipeFilterQuery): void {
    // Object.keys(this.searchForm.getRawValue()).forEach((key) => {
    // 	if (values[key]) {
    // 		this.filterQuery[key] = values[key];
    // 	}
    // });
    this.filterQuery.page = 0;
    console.log('new value', values, this.filterQuery);
    this.stateService.setRecipeFilterQuery(this.filterQuery);
  }

  // TODO: change to a getter/setter pattern.
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.filterQuery) {
      return;
    }

    if (!!changes.filterQuery && changes.filterQuery.firstChange) {
      this.patchForm(this.filterQuery);
    }
  }

  // triggers from the MatPaginator - emits the filterQuery object
  pageChange(ev: PageEvent): void {
    if (!this.filterQuery) {
      return;
    }

    console.log('page event', ev);
    if (ev.previousPageIndex !== ev.pageIndex) {
      this.filterQuery.page = ev.pageIndex;
    } else {
      this.filterQuery.page = 0;
      this.filterQuery.perPage = ev.pageSize;
    }
    this.stateService.setRecipeFilterQuery(this.filterQuery);
  }

  /**
   * Patches the form with external values.
   * @param item Any external values to hydrate the form.
   */
  patchForm(item: IRecipeFilterQuery) {
    if (!item) {
      item = new RecipeFilterQuery();
    }
    this.searchForm.patchValue({
      name: item.name,
      ingredient: item.ingredient,
      author: item.author,
      totalTime: item.totalTime,
      servingPrice: item.servingPrice, // search priceServing {$le: servingTime}
      recipeCreated: item.recipeCreated, // date number greater than the number set ie today - 7 days
      equipment: item.equipment, // {favouriteFoods: {"$in": ["sushi", "hotdog"]}}
      recipeType: item.recipeType,
      healthLabels: item.healthLabels,
      cuisineType: item.cuisineType,
      allergyWarning: item.allergyWarning, // { "allergyWarnings": { "$not": { "$all": [allergyWarning] } } }
      orderby: item.orderby || 'name',
      perPage: item.perPage || 10,
      page: item.page || 0
    });
  }

  get totalTime(): FormControl {
    return this.searchForm.get('totalTime') as FormControl;
  }
  get servingPrice(): FormControl {
    return this.searchForm.get('servingPrice') as FormControl;
  }

  /**
   * Creates the initial form with blank values.
   * @returns the initial blank form.
   */
  createForm(): FormGroup {
    return this.fb.group({
      name: '',
      ingredient: '',
      author: '',
      totalTime: 0,
      servingPrice: 0, // search priceServing {$le: servingTime}
      recipeCreated: 0, // date number greater than the number set ie today - 7 days
      equipment: [], // {favouriteFoods: {"$in": ["sushi", "hotdog"]}}
      recipeType: [],
      healthLabels: [],
      cuisineType: [],
      allergyWarning: [], // { "allergyWarnings": { "$not": { "$all": [allergyWarning] } } }
      orderby: 'name',
      perPage: environment.resultsPerPage,
      page: 0
    });
  }

  /**
   * Triggered from the template - clears out the filter terms and resets the form.
   */
  clearFilterTerms(): void {
    this.searchForm.reset();
    this.searchForm.patchValue({
      orderby: 'name',
      perPage: environment.resultsPerPage,
      page: 0
    });
    this.filterQuery = this.searchForm.getRawValue();
    if (!!this.filterQuery) {
      this.stateService.setRecipeFilterQuery(this.filterQuery);
    }
  }
}
