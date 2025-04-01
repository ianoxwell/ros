import { Injectable } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IConversion } from '@DomainModels/conversion.dto';
import {
  ICaloricBreakdown,
  IIngredient,
  IMinerals,
  INutrients,
  INutritionProperties,
  IVitamins
} from '@DomainModels/ingredient.dto';
import { IPrice } from '@models/ingredient/ingredient-model';
import { NutrientTotalValidator } from '../validators/nutrient-total.validator';
import { TypedControls } from '@models/common.model';

@Injectable({
  providedIn: 'root'
})
export class IngredientEditFormService {
  constructor(
    private fb: UntypedFormBuilder,
    private nutrientTotalValidator: NutrientTotalValidator
  ) {}

  private initPricesFormGroup(price: IPrice | undefined, isNew = false): UntypedFormGroup {
    const fbGroup = this.fb.group({
      value: [price?.value],
      unit: [price?.unit]
      // brandName: [price?.brandName],
      // price: [price?.price, Validators.min(0)],
      // quantity: [price?.quantity, Validators.min(0)],
      // measurement: price?.measurement,
      // storeName: price?.storeName,
      // lastChecked: price?.lastChecked,
      // apiLink: price?.apiLink
    });

    return fbGroup;
  }

  initConversionFormGroup(convert: IConversion, isNew = false): UntypedFormGroup {
    // const fbGroup = this.fb.group({
    //   baseMeasurementUnit: convert.baseMeasurementUnit?.id,
    //   baseState: convert.baseState?.id,
    //   baseQuantity: [convert.baseQuantity, Validators.min(0)],
    //   convertToMeasurementUnit: convert.convertToMeasurementUnit?.id,
    //   convertToState: convert.convertToState?.id,
    //   convertToQuantity: [convert.convertToQuantity, Validators.min(0)],
    //   preference: [convert.preference, Validators.min(0)]
    // });
    // if (!isNew) {
    //   fbGroup.addControl('id', new UntypedFormControl(convert.id));
    //   fbGroup.addControl('ingredientId', new UntypedFormControl(convert.ingredientId));
    // }
    return this.fb.group({});
  }

  private initGenericFormGroup<T extends INutrients | IMinerals | IVitamins | INutritionProperties | ICaloricBreakdown>(
    data: T
  ): FormGroup<TypedControls<T>> {
    const formGroup: FormGroup = new FormGroup({});
    Object.entries(data).forEach(([key, value]: [string, any]) =>
      formGroup.addControl(key, new FormControl(value, [Validators.min(0)]))
    );

    return formGroup;
  }

  createPriceModel(): IPrice {
    const price: IPrice = {
      value: 0,
      unit: 'each'
    };

    return price;
  }

  createForm(ingredient: IIngredient, isNew: boolean): UntypedFormGroup {
    let conversionSummary: UntypedFormGroup[] = [];
    // let nutritionSummary = [];
    // if editing the ingredient, then populate the additional controls needed to edit any of the sub-documents
    if (!isNew && ingredient) {
      if (!ingredient.estimatedCost) {
        ingredient.estimatedCost = this.createPriceModel();
      }
      if (!ingredient.conversions) {
        ingredient.conversions = [{} as IConversion];
      }
      conversionSummary = ingredient.conversions.map((convert: IConversion) => this.initConversionFormGroup(convert));
    }
    // const allergies = ingredient.allergies?.map((item) => item.id) || [];
    // Create the controls for the reactive forms
    const formGroup = this.fb.group({
      name: [ingredient.name, [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
      // foodGroup: ingredient.foodGroup?.id,
      // allergies,
      // ingredientStateId: ingredient.ingredientStateId,
      purchasedBy: ingredient.purchasedBy,
      // linkUrl: ingredient.linkUrl,
      // pralScore: ingredient.pralScore,
      // usdaFoodId: ingredient.usdaFoodId,
      price: this.initPricesFormGroup(ingredient.estimatedCost),
      ingredientConversions: this.fb.array(conversionSummary)
    });

    if (ingredient.nutrition) {
      formGroup.addControl('nutrients', this.initGenericFormGroup<INutrients>(ingredient.nutrition.nutrients));
      formGroup.addControl('vitamins', this.initGenericFormGroup<IVitamins>(ingredient.nutrition.vitamins));
      formGroup.addControl('minerals', this.initGenericFormGroup<IMinerals>(ingredient.nutrition.minerals));
      formGroup.addControl(
        'nutritionProperties',
        this.initGenericFormGroup<INutritionProperties>(ingredient.nutrition.properties)
      );
      formGroup.addControl(
        'caloricBreakdown',
        this.initGenericFormGroup<ICaloricBreakdown>(ingredient.nutrition.caloricBreakdown)
      );
    }

    return formGroup;
  }
}
