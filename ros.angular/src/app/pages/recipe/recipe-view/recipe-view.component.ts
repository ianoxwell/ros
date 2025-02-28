import { Component, Input, OnInit } from '@angular/core';
import { IRecipe } from '@DomainModels/recipe.dto';
import { IMeasurement } from '@models/ingredient/ingredient-model';
import { IRecipeIngredient } from '@models/recipe-ingredient.model';
import { SentenceCasePipe } from '@pipes/sentence-case.pipe';

@Component({
    selector: 'app-recipe-view',
    templateUrl: './recipe-view.component.html',
    styleUrls: ['./recipe-view.component.scss'],
    standalone: false
})
export class RecipeViewComponent implements OnInit {
  @Input({ required: true }) selectedRecipe!: IRecipe;
  @Input() measurements: IMeasurement[] = [];

  constructor() {}

  ngOnInit() {
    console.log('recipe view', this.selectedRecipe);
  }

  printView() {
    // todo complete the print views
    console.log('go and print');
  }

}
