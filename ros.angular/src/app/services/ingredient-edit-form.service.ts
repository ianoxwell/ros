import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IConversion } from '@DomainModels/conversion.dto';
import { ICaloricBreakdown, IIngredient, INutrients, INutritionProperties } from '@DomainModels/ingredient.dto';
import { IPrice } from '@models/ingredient/ingredient-model';
import { NutrientTotalValidator } from '../validators/nutrient-total.validator';

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

  private initNutritionPropertiesFormGroup(nutrition: INutritionProperties | undefined): UntypedFormGroup {
    const fbGroup = this.fb.group(
      {
        glycemicIndex: [nutrition?.glycemicIndex, [Validators.min(0)]],
        glycemicLoad: [nutrition?.glycemicLoad, [Validators.min(0)]],
        nutritionScore: [nutrition?.nutritionScore, [Validators.min(0)]]

        // calories: [nutrition?.calories, [Validators.min(0)]],
        // cholesterol: [nutrition?.cholesterol, [Validators.min(0)]],
        // dietaryFiber: [nutrition?.dietaryFiber, [Validators.min(0)]],
        // monoUnsaturatedFat: [nutrition?.monoUnsaturatedFat, [Validators.min(0)]],
        // omega3s: [nutrition?.omega3s, [Validators.min(0)]],
        // omega6s: [nutrition?.omega6s, [Validators.min(0)]],
        // polyUnsaturatedFat: [nutrition?.polyUnsaturatedFat, [Validators.min(0)]],
        // protein: [nutrition?.protein, [Validators.min(0)]],
        // saturatedFat: [nutrition?.saturatedFat, [Validators.min(0)]],
        // totalCarbohydrate: [nutrition?.totalCarbohydrate, [Validators.min(0)]],
        // totalFat: [nutrition?.totalFat, [Validators.min(0)]],
        // totalSugars: [nutrition?.totalSugars, [Validators.min(0)]],
        // transFat: [nutrition?.transFat, [Validators.min(0)]],
        // water: [nutrition?.water, [Validators.min(0)]]
      },
      { validators: [this.nutrientTotalValidator.totalCalc()] }
    );
    return fbGroup;
  }

  private initNutrientsFormGroup(minerals: INutrients | undefined): UntypedFormGroup {
    const fbGroup = this.fb.group({
      calories: [minerals?.calories, [Validators.min(0)]],
      fat: [minerals?.fat, [Validators.min(0)]],
      transFat: [minerals?.transFat, [Validators.min(0)]],
      saturatedFat: [minerals?.saturatedFat, [Validators.min(0)]],
      monoUnsaturatedFat: [minerals?.monoUnsaturatedFat, [Validators.min(0)]],
      polyUnsaturatedFat: [minerals?.polyUnsaturatedFat, [Validators.min(0)]],
      protein: [minerals?.protein, [Validators.min(0)]],
      cholesterol: [minerals?.cholesterol, [Validators.min(0)]],
      carbohydrates: [minerals?.carbohydrates, [Validators.min(0)]],
      netCarbohydrates: [minerals?.netCarbohydrates, [Validators.min(0)]],
      alcohol: [minerals?.alcohol, [Validators.min(0)]],
      fiber: [minerals?.fiber, [Validators.min(0)]],
      sugar: [minerals?.sugar, [Validators.min(0)]],
      sodium: [minerals?.sodium, [Validators.min(0)]],
      caffeine: [minerals?.caffeine, [Validators.min(0)]],
      manganese: [minerals?.manganese, [Validators.min(0)]],
      potassium: [minerals?.potassium, [Validators.min(0)]],
      magnesium: [minerals?.magnesium, [Validators.min(0)]],
      calcium: [minerals?.calcium, [Validators.min(0)]],
      copper: [minerals?.copper, [Validators.min(0)]],
      zinc: [minerals?.zinc, [Validators.min(0)]],
      phosphorus: [minerals?.phosphorus, [Validators.min(0)]],
      fluoride: [minerals?.fluoride, [Validators.min(0)]],
      choline: [minerals?.choline, [Validators.min(0)]],
      iron: [minerals?.iron, [Validators.min(0)]],
      vitaminA: [minerals?.vitaminA, [Validators.min(0)]],
      vitaminB1: [minerals?.vitaminB1, [Validators.min(0)]],
      vitaminB2: [minerals?.vitaminB2, [Validators.min(0)]],
      vitaminB3: [minerals?.vitaminB3, [Validators.min(0)]],
      vitaminB5: [minerals?.vitaminB5, [Validators.min(0)]],
      vitaminB6: [minerals?.vitaminB6, [Validators.min(0)]],
      vitaminB12: [minerals?.vitaminB12, [Validators.min(0)]],
      vitaminC: [minerals?.vitaminC, [Validators.min(0)]],
      vitaminD: [minerals?.vitaminD, [Validators.min(0)]],
      vitaminE: [minerals?.vitaminE, [Validators.min(0)]],
      vitaminK: [minerals?.vitaminK, [Validators.min(0)]],
      folate: [minerals?.folate, [Validators.min(0)]],
      folicAcid: [minerals?.folicAcid, [Validators.min(0)]],
      iodine: [minerals?.iodine, [Validators.min(0)]],
      selenium: [minerals?.selenium, [Validators.min(0)]]

      // calcium: [minerals?.calcium, [Validators.min(0)]],
      // copperCu: [minerals?.copperCu, [Validators.min(0)]],
      // fluorideF: [minerals?.fluorideF, [Validators.min(0)]],
      // ironFe: [minerals?.ironFe, [Validators.min(0)]],
      // magnesium: [minerals?.magnesium, [Validators.min(0)]],
      // manganese: [minerals?.manganese, [Validators.min(0)]],
      // potassiumK: [minerals?.potassiumK, [Validators.min(0)]],
      // seleniumSe: [minerals?.seleniumSe, [Validators.min(0)]],
      // sodium: [minerals?.sodium, [Validators.min(0)]],
      // zincZn: [minerals?.zincZn, [Validators.min(0)]]
    });
    return fbGroup;
  }

  private initCaloricBreakdownFormGroup(vita: ICaloricBreakdown | undefined): UntypedFormGroup {
    const fbGroup = this.fb.group({
      percentProtein: [vita?.percentProtein, [Validators.min(0)]],
      percentFat: [vita?.percentProtein, [Validators.min(0)]],
      percentCarbs: [vita?.percentProtein, [Validators.min(0)]]

      // folateB9: [vita?.folateB9, [Validators.min(0)]],
      // folateDfe: [vita?.folateDfe, [Validators.min(0)]],
      // folicAcid: [vita?.folicAcid, [Validators.min(0)]],
      // foodFolate: [vita?.foodFolate, [Validators.min(0)]],
      // niacinB3: [vita?.niacinB3, [Validators.min(0)]],
      // pantothenicAcidB5: [vita?.pantothenicAcidB5, [Validators.min(0)]],
      // riboflavinB2: [vita?.riboflavinB2, [Validators.min(0)]],
      // thiaminB1: [vita?.thiaminB1, [Validators.min(0)]],
      // vitaminAIu: [vita?.vitaminAIu, [Validators.min(0)]],
      // vitaminARae: [vita?.vitaminARae, [Validators.min(0)]],
      // vitaminB6: [vita?.vitaminB6, [Validators.min(0)]],
      // vitaminB12: [vita?.vitaminB12, [Validators.min(0)]],
      // vitaminC: [vita?.vitaminC, [Validators.min(0)]],
      // vitaminD: [vita?.vitaminD, [Validators.min(0)]],
      // vitaminDIu: [vita?.vitaminDIu, [Validators.min(0)]],
      // vitaminE: [vita?.vitaminE, [Validators.min(0)]],
      // vitaminK: [vita?.vitaminK, [Validators.min(0)]]
    });
    return fbGroup;
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
    return this.fb.group({
      name: [ingredient.name, [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
      // foodGroup: ingredient.foodGroup?.id,
      // allergies,
      // ingredientStateId: ingredient.ingredientStateId,
      purchasedBy: ingredient.purchasedBy,
      // linkUrl: ingredient.linkUrl,
      // pralScore: ingredient.pralScore,
      // usdaFoodId: ingredient.usdaFoodId,
      price: this.initPricesFormGroup(ingredient.estimatedCost),
      ingredientConversions: this.fb.array(conversionSummary),

      nutrients: this.initNutrientsFormGroup(ingredient.nutrition?.nutrients),
      nutritionProperties: this.initNutritionPropertiesFormGroup(ingredient.nutrition?.properties),
      caloricBreakdown: this.initCaloricBreakdownFormGroup(ingredient.nutrition?.caloricBreakdown)
    });
  }
}
