import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IRecipe, IRecipeShort } from '@DomainModels/recipe.dto';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
  standalone: false
})
export class RecipeCardComponent {
  @Input() recipeInput: IRecipeShort | undefined;
  @Output() clickedRecipe = new EventEmitter<IRecipeShort>();

  more() {
    console.log('guess what - more');
  }
}
