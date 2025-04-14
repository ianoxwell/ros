import { Component, Input } from '@angular/core';
import { IRecipeShort } from '@DomainModels/recipe.dto';
import { NavigationService } from '@services/navigation/navigation.service';
import { CRouteList } from '@services/navigation/route-list.const';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
  standalone: false
})
export class RecipeCardComponent {
  @Input({ required: true }) recipeInput!: IRecipeShort;

  constructor(private navigationService: NavigationService) {}

  selectThisRecipe() {
    this.navigationService.navigateToUrl(`${CRouteList.recipe}/${this.recipeInput.id}`);
  }
}
