import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe } from '@models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent {
  @Input() recipeInput: Recipe | undefined;
  @Output() clickedRecipe = new EventEmitter<Recipe>();

  more() {
    console.log('guess what - more');
  }
}
