import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentBase } from '@components/base/base.component.base';
import { IIngredient } from '@models/ingredient/ingredient.model';
import { MessageStatus } from '@models/message.model';
import { IRawFoodIngredient, IRawFoodSuggestion } from '@models/raw-food-ingredient.model';
import { IReferenceItemFull } from '@models/reference.model';
import { ConstructIngredientService } from '@services/construct-ingredient.service';
import { MessageService } from '@services/message.service';
import { RestIngredientService } from '@services/rest-ingredient.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, debounceTime, filter, first, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-ingredient-match',
  templateUrl: './dialog-ingredient-match.component.html',
  styleUrls: ['./dialog-ingredient-match.component.scss']
})
export class DialogIngredientMatchComponent extends ComponentBase implements OnInit {
  form: FormGroup;
  usdaFoodMatched: IRawFoodIngredient | null = null;
  filterRawSuggestions$: Observable<IRawFoodSuggestion[]> = of([]);

  constructor(
    public dialogRef: MatDialogRef<DialogIngredientMatchComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      ingredient: IIngredient;
      foodGroup: IReferenceItemFull[];
    },
    private fb: FormBuilder,
    private constructIngredientService: ConstructIngredientService,
    private restIngredientService: RestIngredientService,
    private messageService: MessageService
  ) {
    super();
    this.form = this.createForm();
  }

  ngOnInit() {
    console.log('match dialog', this.data);
    this.filterRawSuggestions$ = this.listenFormChanges();
    // wrapped in timeout to allow time for the dom to draw.
    setTimeout(() => this.patchForm(this.data.ingredient), 50);
  }

  get usdaFoodName(): FormControl {
    return this.form.get('usdaFoodName') as FormControl;
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
      name: [{ value: this.data.ingredient.name, disabled: true }],
      usdaFoodName: ['', [Validators.required]],
      foodGroup: null
    });
  }

  /**
   * After form creation and listening for changes the form is patched to cause both observables to emit.
   * @param ingredient The ingredient to update with.
   */
  patchForm(ingredient: IIngredient, emit = true): void {
    this.form.patchValue(
      {
        usdaFoodName: ingredient.name,
        foodGroup: ingredient.foodGroup?.id
      },
      { emitEvent: emit }
    );
  }

  /**
   * Listens for changes in rawName and foodGroup in the form.
   * Be aware that combineLatest will not emit an initial value until each observable emits at least one value.
   * Therefore we are patching the form to trigger both observables on initialisation.
   * @returns observable Food suggestions from the raw USDA food db.
   */
  listenFormChanges(): Observable<IRawFoodSuggestion[]> {
    return combineLatest([this.usdaFoodName.valueChanges, this.foodGroup.valueChanges]).pipe(
      debounceTime(200),
      filter(([item, foodId]: [string, number]) => !!item),
      switchMap(([rawFood, foodGroupId]: [string, number]) => {
        const formRaw = this.form.getRawValue();
        this.data.ingredient.foodGroup = this.data.foodGroup.find(
          (group: IReferenceItemFull) => group.id === formRaw.foodGroup
        );
        return this.data.ingredient.foodGroup?.title === 'NULL'
          ? this.restIngredientService.getRawFoodSuggestion(rawFood, 20)
          : this.restIngredientService.getRawFoodSuggestion(rawFood, 20, foodGroupId);
      })
    );
  }

  /**
   * Triggered from the template, uses rest service to populate the usdaFoodMatched.
   * @param item The Usda food item to be selected.
   */
  selectItem(item: IRawFoodSuggestion): void {
    console.log('selected this item', item);
    const formRaw = this.form.getRawValue();
    const nullFoodGroup: IReferenceItemFull | undefined = this.data.foodGroup.find(
      (group: IReferenceItemFull) => group.title === 'NULL'
    );
    if (!!nullFoodGroup && formRaw.foodGroup === nullFoodGroup.id) {
      this.data.ingredient.foodGroup = this.data.foodGroup.find(
        (group: IReferenceItemFull) => group.title.toLowerCase() === item.foodGroup.toLowerCase()
      );
      this.data.ingredient.name = item.name;
      this.patchForm(this.data.ingredient, false);
    }
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
   * Triggered from the template - updates the ingredient and closes the dialog
   */
  onSaveItem() {
    if (!!this.usdaFoodMatched) {
      const updatedIngredient: IIngredient = this.constructIngredientService.mixinUsdaResults(
        this.data.ingredient,
        this.usdaFoodMatched
      );
      this.dialogRef.close(updatedIngredient);
    } else {
      this.dialogRef.close(this.data.ingredient);
    }
  }
}
