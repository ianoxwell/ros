import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Conversion } from '@models/conversion';
import { IIngredient } from '@models/ingredient/ingredient.model';
import { ICommonMinerals, ICommonVitamins, INutritionFacts, IPrice } from '@models/ingredient/ingredient-model';
import { Price } from '@models/price';
import { NutrientTotalValidator } from '../validators/nutrient-total.validator';

@Injectable({
  providedIn: 'root'
})
export class IngredientEditFormService {
  constructor(private fb: FormBuilder, private nutrientTotalValidator: NutrientTotalValidator) {}

  private initPricesFormGroup(price: Price | undefined, isNew = false): FormGroup {
    const fbGroup = this.fb.group({
      brandName: [price?.brandName],
      price: [price?.price, Validators.min(0)],
      quantity: [price?.quantity, Validators.min(0)],
      measurement: price?.measurement,
      storeName: price?.storeName,
      lastChecked: price?.lastChecked,
      apiLink: price?.apiLink
    });
    if (!isNew) {
      fbGroup.addControl('id', new FormControl(price?.id));
    }
    return fbGroup;
  }

  initConversionFormGroup(convert: Conversion, isNew = false): FormGroup {
    const fbGroup = this.fb.group({
      baseMeasurementUnit: convert.baseMeasurementUnit?.id,
      baseState: convert.baseState?.id,
      baseQuantity: [convert.baseQuantity, Validators.min(0)],
      convertToMeasurementUnit: convert.convertToMeasurementUnit?.id,
      convertToState: convert.convertToState?.id,
      convertToQuantity: [convert.convertToQuantity, Validators.min(0)],
      preference: [convert.preference, Validators.min(0)]
    });
    if (!isNew) {
      fbGroup.addControl('id', new FormControl(convert.id));
      fbGroup.addControl('ingredientId', new FormControl(convert.ingredientId));
    }
    return fbGroup;
  }

  private initNutritionFactsFormGroup(nutrition: INutritionFacts | undefined): FormGroup {
    const fbGroup = this.fb.group(
      {
        calories: [nutrition?.calories, [Validators.min(0)]],
        cholesterol: [nutrition?.cholesterol, [Validators.min(0)]],
        dietaryFiber: [nutrition?.dietaryFiber, [Validators.min(0)]],
        monoUnsaturatedFat: [nutrition?.monoUnsaturatedFat, [Validators.min(0)]],
        omega3s: [nutrition?.omega3s, [Validators.min(0)]],
        omega6s: [nutrition?.omega6s, [Validators.min(0)]],
        polyUnsaturatedFat: [nutrition?.polyUnsaturatedFat, [Validators.min(0)]],
        protein: [nutrition?.protein, [Validators.min(0)]],
        saturatedFat: [nutrition?.saturatedFat, [Validators.min(0)]],
        totalCarbohydrate: [nutrition?.totalCarbohydrate, [Validators.min(0)]],
        totalFat: [nutrition?.totalFat, [Validators.min(0)]],
        totalSugars: [nutrition?.totalSugars, [Validators.min(0)]],
        transFat: [nutrition?.transFat, [Validators.min(0)]],
        water: [nutrition?.water, [Validators.min(0)]]
      },
      { validators: [this.nutrientTotalValidator.totalCalc()] }
    );
    return fbGroup;
  }

  private initCommonMineralsFormGroup(minerals: ICommonMinerals | undefined): FormGroup {
    const fbGroup = this.fb.group({
      calcium: [minerals?.calcium, [Validators.min(0)]],
      copperCu: [minerals?.copperCu, [Validators.min(0)]],
      fluorideF: [minerals?.fluorideF, [Validators.min(0)]],
      ironFe: [minerals?.ironFe, [Validators.min(0)]],
      magnesium: [minerals?.magnesium, [Validators.min(0)]],
      manganese: [minerals?.manganese, [Validators.min(0)]],
      potassiumK: [minerals?.potassiumK, [Validators.min(0)]],
      seleniumSe: [minerals?.seleniumSe, [Validators.min(0)]],
      sodium: [minerals?.sodium, [Validators.min(0)]],
      zincZn: [minerals?.zincZn, [Validators.min(0)]]
    });
    return fbGroup;
  }

  private initCommonVitaminsFormGroup(vita: ICommonVitamins | undefined): FormGroup {
    const fbGroup = this.fb.group({
      folateB9: [vita?.folateB9, [Validators.min(0)]],
      folateDfe: [vita?.folateDfe, [Validators.min(0)]],
      folicAcid: [vita?.folicAcid, [Validators.min(0)]],
      foodFolate: [vita?.foodFolate, [Validators.min(0)]],
      niacinB3: [vita?.niacinB3, [Validators.min(0)]],
      pantothenicAcidB5: [vita?.pantothenicAcidB5, [Validators.min(0)]],
      riboflavinB2: [vita?.riboflavinB2, [Validators.min(0)]],
      thiaminB1: [vita?.thiaminB1, [Validators.min(0)]],
      vitaminAIu: [vita?.vitaminAIu, [Validators.min(0)]],
      vitaminARae: [vita?.vitaminARae, [Validators.min(0)]],
      vitaminB6: [vita?.vitaminB6, [Validators.min(0)]],
      vitaminB12: [vita?.vitaminB12, [Validators.min(0)]],
      vitaminC: [vita?.vitaminC, [Validators.min(0)]],
      vitaminD: [vita?.vitaminD, [Validators.min(0)]],
      vitaminDIu: [vita?.vitaminDIu, [Validators.min(0)]],
      vitaminE: [vita?.vitaminE, [Validators.min(0)]],
      vitaminK: [vita?.vitaminK, [Validators.min(0)]]
    });
    return fbGroup;
  }

  createPriceModel(): IPrice {
    const price: IPrice = {
      brandName: '',
      price: 0,
      quantity: 0,
      storeName: '',
      measurement: '',
      lastChecked: 0,
      apiLink: ''
    };

    return price;
  }

  createForm(ingredient: IIngredient, isNew: boolean): FormGroup {
    let conversionSummary: FormGroup[] = [];
    // let nutritionSummary = [];
    // if editing the ingredient, then populate the additional controls needed to edit any of the sub-documents
    if (!isNew && ingredient) {
      if (!ingredient.price) {
        ingredient.price = this.createPriceModel();
      }
      if (!ingredient.ingredientConversions) {
        ingredient.ingredientConversions = [{} as Conversion];
      }
      conversionSummary = ingredient.ingredientConversions.map((convert: Conversion) =>
        this.initConversionFormGroup(convert)
      );
    }
    const allergies = ingredient.allergies?.map((item) => item.id) || [];
    // Create the controls for the reactive forms
    return this.fb.group({
      name: [ingredient.name, [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
      foodGroup: ingredient.foodGroup?.id,
      allergies,
      ingredientStateId: ingredient.ingredientStateId,
      purchasedBy: ingredient.purchasedBy,
      linkUrl: ingredient.linkUrl,
      pralScore: ingredient.pralScore,
      usdaFoodId: ingredient.usdaFoodId,
      price: this.initPricesFormGroup(ingredient.price),
      ingredientConversions: this.fb.array(conversionSummary),

      nutritionFacts: this.initNutritionFactsFormGroup(ingredient.nutritionFacts),
      commonMinerals: this.initCommonMineralsFormGroup(ingredient.commonMinerals),
      commonVitamins: this.initCommonVitaminsFormGroup(ingredient.commonVitamins)
    });
  }
}
