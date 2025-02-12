import { Injectable } from '@angular/core';
import { Conversion } from '@models/conversion';
import { IIngredient } from '@models/ingredient/ingredient.model';
import { IMeasurement } from '@models/ingredient/ingredient-model';
import { IRawFoodIngredient, ISpoonConversion, ISpoonFoodRaw } from '@models/raw-food-ingredient.model';
import { IReferenceItemFull } from '@models/reference.model';
// import { IngredientModel, ConversionModel, PriceModel } from './ingredient-model';

@Injectable({
  providedIn: 'root'
})
export class ConstructIngredientService {
  public createNewIngredient(
    basicInfo: { name: string; foodGroup: number },
    spoon: ISpoonFoodRaw | null,
    spoonConversions: ISpoonConversion[],
    foodGroupRef: IReferenceItemFull[] | undefined,
    ingredientStateRef: IReferenceItemFull[] | undefined,
    measurementRef: IMeasurement[],
    usda: IRawFoodIngredient | null
  ): IIngredient {
    if (!spoon) {
      throw 'SpoonFood Raw not defined';
    }

    const ingredientState: IReferenceItemFull | undefined = ingredientStateRef?.find(
      (state: IReferenceItemFull) => state.title.toLowerCase() === spoon.consistency.toLowerCase()
    );
    let newIngredient: IIngredient = {
      id: 0,
      name: basicInfo.name,
      foodGroup: foodGroupRef?.find((food: IReferenceItemFull) => food.id === basicInfo.foodGroup),

      linkUrl: spoon.id,
      ingredientStateId: ingredientState ? ingredientState.id : 0,
      ingredientConversions: this.conversions(spoonConversions, ingredientState, measurementRef)
    };
    if (usda) {
      newIngredient = this.mixinUsdaResults(newIngredient, usda);
    }

    return newIngredient;
  }
  /**
   * Mixes in the new ingredient with data from the UsdaFood table.
   * @param newIngredient The new Ingredient to mix with.
   * @param usda The raw result from the Usda food db.
   * @returns Ingredient.
   */
  mixinUsdaResults(newIngredient: IIngredient, usda: IRawFoodIngredient): IIngredient {
    const mixedResult = {
      ...newIngredient,
      usdaFoodId: usda.id,
      pralScore: usda.pralScore,
      commonMinerals: usda.commonMinerals,
      commonVitamins: usda.commonVitamins,
      nutritionFacts: usda.nutritionFacts
    };
    console.log('mixin', newIngredient, usda, mixedResult);
    return mixedResult;
  }

  findMeasureModel(title: string, measure: IMeasurement[]): IMeasurement | undefined {
    const measurementEach: IMeasurement | undefined = measure.find(
      (m: IMeasurement) => m.title.toLowerCase() === 'each'
    );

    if (!title || title.length === 0) {
      return measurementEach;
    }

    const measurement: IMeasurement | undefined = measure.find((m: IMeasurement) => {
      const success =
        m.title.toLowerCase() === title.toLowerCase() ||
        m.shortName?.toLowerCase() === title.toLowerCase() ||
        m.altShortName?.toLowerCase() === title.toLowerCase();
      return success;
    });
    // if not matched then default to each
    if (!measurement) {
      return measurementEach;
    }

    return measurement;
  }

  private conversions(
    convert: ISpoonConversion[],
    ingredientState: IReferenceItemFull | undefined,
    measure: IMeasurement[]
  ): Conversion[] {
    // expect convert to be an array returned from dialog-ingredient.component or a partial object
    // {key: newKey, value: newValue, changeType: 'sub', subDocName: 'conversions', subId: docSubId}
    console.log('starting the conversion process', ingredientState, measure);
    if (!ingredientState) {
      return [];
    }

    const returnConvert: Conversion[] = convert.map((item: ISpoonConversion, idx: number) => {
      if (item.sourceUnit === '') {
        // convert US to AU cups - approximation based on general results of known items
        item.targetAmount = Math.floor(item.targetAmount / 0.94636);
      }
      return {
        baseState: ingredientState,
        baseMeasurementUnit: this.findMeasureModel(item.sourceUnit, measure), // [0],
        baseQuantity: 1,
        convertToState: ingredientState,
        convertToMeasurementUnit: this.findMeasureModel(item.targetUnit, measure),
        convertToQuantity: item.targetAmount,
        answer: item.answer,
        preference: idx
      };
    });
    return returnConvert;
  }
}
