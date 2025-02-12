import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentBase } from '@components/base/base.component.base';
import { IMeasurement } from '@models/ingredient/ingredient-model';
import { IIngredient } from '@models/ingredient/ingredient.model';
import { MessageStatus } from '@models/message.model';
import {
  IRawFoodIngredient,
  IRawFoodSuggestion,
  ISpoonConversion,
  ISpoonFoodRaw,
  ISpoonSuggestions
} from '@models/raw-food-ingredient.model';
import { IReferenceItemFull } from '@models/reference.model';
import { ConstructIngredientService } from '@services/construct-ingredient.service';
import { MessageService } from '@services/message.service';
import { RestIngredientService } from '@services/rest-ingredient.service';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, debounceTime, filter, first, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-new-ingredient',
  templateUrl: './dialog-new-ingredient.component.html',
  styleUrls: ['./dialog-new-ingredient.component.scss']
})

// done check that ingredient name is available in ingredientsDB
// TODO trigger search on food group changing
// TODO edit the DTO and create a transform object to give full data for RawFood Ingredient Model
// TODO Make Table so that item is selectable - header Match Nutrient Data with USDA database
// TODO Button to complete fields from Spoonacular - after USDA food is selected?
// TODO Make similar table from Spoonacular showing potential suggestion matches for ingredient
// TODO If no matches found from USDA get nutrient data from Spoonacular
// TODO Add origin to the dialog (eg recipeImport || ingredients)
// TODO Create new Ingredient from all the relevant information and if origin was ingredients navigate to the editable ingredient
export class DialogNewIngredientComponent extends ComponentBase implements OnInit {
  form: FormGroup;
  filterRawSuggestions$: Observable<IRawFoodSuggestion[]> = of([]);
  rawFoodFilter$ = new BehaviorSubject<string>('');

  isFoodNameAvailable: boolean | null = null;
  isCheckingFoodName = false;

  usdaFoodMatched: IRawFoodIngredient | null = null;
  spoonFoodSuggestions: ISpoonSuggestions[] = [];
  spoonFoodMatched: ISpoonFoodRaw | null = null;
  spoonConversion: ISpoonConversion[] = [];
  newIngredient: IIngredient | null = null;

  constructor(
    public dialogRef: MatDialogRef<DialogNewIngredientComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      foodGroup: IReferenceItemFull[];
      ingredientStateRef: IReferenceItemFull[];
      measurements: IMeasurement[];
    },
    private fb: FormBuilder,
    private messageService: MessageService,
    private constructIngredientService: ConstructIngredientService,
    private restIngredientService: RestIngredientService
  ) {
    super();
    dialogRef.disableClose = true;
    this.form = this.createForm();
  }

  ngOnInit() {
    this.filterRawSuggestions$ = this.listenFormChanges();
  }

  /**
   * Listens for changes in rawName and foodGroup in the form.
   * @returns observable Food suggestions from the raw USDA food db.
   */
  listenFormChanges(): Observable<IRawFoodSuggestion[]> {
    return combineLatest([this.rawName.valueChanges, this.foodGroup.valueChanges]).pipe(
      debounceTime(200),
      filter(([item, foodId]: [string, number]) => !!item),
      switchMap(([rawFood, foodGroupId]: [string, number]) => {
        if (rawFood.length > 2) {
          this.checkNameExists(rawFood);
        } else {
          this.isFoodNameAvailable = null;
        }
        const formRaw = this.form.getRawValue();
        return this.restIngredientService.getRawFoodSuggestion(rawFood, 20, foodGroupId);
      })
    );
  }
  get rawName(): FormControl {
    return this.form.get('name') as FormControl;
  }
  get foodGroup(): FormControl {
    return this.form.get('foodGroup') as FormControl;
  }
  /**
   * Creates the initial form
   * @returns Form Group containing the form
   */
  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      foodGroup: null
    });
  }
  onFilterChange(ev: string): void {
    this.rawFoodFilter$.next(ev);
  }

  /**
   * Triggered from the template, uses rest service to populate the usdaFoodMatched.
   * @param item The Usda food item to be selected.
   */
  selectItem(item: IRawFoodSuggestion): void {
    console.log('selected this item', item);
    this.restIngredientService
      .getRawFoodById(item.usdaId)
      .pipe(
        first(),
        tap((result: IRawFoodIngredient) => {
          console.log('raw food matched', result);
          this.usdaFoodMatched = result;
        }),
        catchError((error: unknown) => {
          const err = error as HttpErrorResponse;
          this.messageService.add({
            severity: MessageStatus.Warning,
            summary: 'Error getting details about the Usda Food item',
            detail: err.message
          });
          return of();
        })
      )
      .subscribe();
  }
  /**
   * Triggered from the template - creates new ingredient and closes the dialog
   */
  onSaveItem() {
    this.newIngredient = this.constructIngredientService.createNewIngredient(
      this.form.getRawValue(),
      this.spoonFoodMatched,
      this.spoonConversion,
      this.data.foodGroup,
      this.data.ingredientStateRef,
      this.data.measurements,
      this.usdaFoodMatched
    );
    this.dialogRef.close(this.newIngredient);
  }

  checkNameExists(name: string): void {
    this.isCheckingFoodName = true;
    this.isFoodNameAvailable = null;
    this.restIngredientService
      .checkFoodNameExists(name)
      .pipe(
        first(),
        tap((result: boolean) => {
          this.isCheckingFoodName = false;
          this.isFoodNameAvailable = !result;
        })
      )
      .subscribe();
  }

  findSpoonSuggestionsOnline(): void {
    this.restIngredientService
      .getSpoonacularSuggestions(this.rawName.value)
      .pipe(
        first(),
        tap((result: ISpoonSuggestions[]) => {
          this.spoonFoodSuggestions = result;
        })
      )
      .subscribe();
  }

  selectSpoonItem(spoonSuggestion: ISpoonSuggestions): void {
    this.restIngredientService
      .getSpoonacularIngredient(spoonSuggestion.id.toString())
      .pipe(
        switchMap((result: ISpoonFoodRaw) => {
          this.spoonFoodMatched = result;
          // const unitFrom: string = result.shoppingListUnits[0];
          // const unitFromRef = this.data.measurements
          // 	.find((measure: MeasurementModel)	=> measure.title.toLowerCase() === unitFrom || measure.shortName.toLowerCase() === unitFrom);
          const unitFrom = result.possibleUnits.includes('cup') ? 'cup' : 'piece';
          return this.restIngredientService.getSpoonConversion(result.name, unitFrom, 1, 'grams');
        }),
        tap((convertResult: ISpoonConversion) => {
          this.spoonConversion.push(convertResult);
          console.log('spoon finished', this.spoonFoodMatched, this.spoonConversion);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }
}
