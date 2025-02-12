import { Component, Input, OnInit } from '@angular/core';
import { IRecipeIngredient } from '@models/recipe-ingredient.model';
import { IMeasurement } from '@models/ingredient/ingredient-model';
import { Recipe } from '@models/recipe.model';
import { SentenceCasePipe } from '@pipes/sentence-case.pipe';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss']
})
export class RecipeViewComponent implements OnInit {
  @Input() selectedRecipe: Recipe | undefined;
  @Input() measurements: IMeasurement[] = [];

  constructor(private sentenceCase: SentenceCasePipe) {}

  ngOnInit() {
    console.log('recipe view', this.selectedRecipe);
  }

  printView() {
    // todo complete the print views
    console.log('go and print');
  }

  englishIngredientItem(ingredient: IRecipeIngredient): string {
    const unit = ingredient.measurementUnit?.title;
    if (!unit) {
      console.log('no unit', ingredient);
    }
    // TODO re-establish the below
    // if (unit.length < 5 || unit === 'tbsps') {
    // 	const newUnit = this.measurements.find(measure => (measure.shortName === unit || measure.altShortName === unit));
    // 	if (!!newUnit) {
    // 		unit = newUnit.title;
    // 	}
    // }
    return `${ingredient.quantity} ${unit} ${this.sentenceCase.transform(ingredient.ingredient?.name)}`;
  }

  routerLinkURL(ingredient: IRecipeIngredient): string {
    return `/savoury/ingredients/item/${ingredient.ingredientId}`;
  }
}
