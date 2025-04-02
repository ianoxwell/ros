import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRecipe } from '@DomainModels/recipe.dto';
import { CRouteList } from '@services/navigation/route-list.const';
import { catchError, firstValueFrom, of, timer } from 'rxjs';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss'],
  standalone: false
})
export class RecipeViewComponent implements OnInit {
  selectedRecipe: IRecipe | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  async ngOnInit() {
    const recipeId = this.route.snapshot.paramMap.get('recipeId');
    if (recipeId) {
      // Load the recipe using the recipeId
      this.selectedRecipe = (await this.loadRecipeSelect(parseInt(recipeId))) || undefined;
      if (this.selectedRecipe) {
        return;
      }
    }

    // Redirect to the recipes list
    await firstValueFrom(timer(500));
    this.router.navigate([CRouteList.recipes]);
  }

  async loadRecipeSelect(itemId: number | undefined): Promise<null | IRecipe> {
    if (!itemId) {
      return null;
    }

    return await firstValueFrom(
      this.recipeService.getRecipeById(itemId).pipe(
        catchError((error: unknown) => {
          const err = error as HttpErrorResponse;
          console.log('Error', err);
          return of(null);
        })
      )
    );
  }
  backToRecipes() {
    this.router.navigate([CRouteList.recipes]);
  }

  printView() {
    // todo complete the print views
    console.log('go and print');
  }
}
