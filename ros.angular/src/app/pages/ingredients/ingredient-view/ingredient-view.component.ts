import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CRouteList } from '@services/navigation/route-list.const';
import { catchError, firstValueFrom, of, timer } from 'rxjs';
import { IngredientService } from '../ingredient.service';
import { IIngredient, IMinerals, IVitamins } from '@DomainModels/ingredient.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { CVitaminsMinerals } from '@DomainModels/vitamin-mineral-const';
import { fixWholeNumber } from 'src/app/utils/number-utils';

interface IDisplayVitMin {
  value: string;
  percentRda: number;
  name: string;
  measure: string;
  shortName: string;
}

@Component({
  selector: 'app-ingredient-view',
  standalone: false,
  templateUrl: './ingredient-view.component.html',
  styleUrl: './ingredient-view.component.scss'
})
export class IngredientViewComponent implements OnInit {
  ingredient: IIngredient | undefined;
  minerals: IDisplayVitMin[] = [];
  vitamins: IDisplayVitMin[] = [];
  calories = '';  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ingredientService: IngredientService
  ) {}

  async ngOnInit() {
    const ingredientId = this.route.snapshot.paramMap.get('ingredientId');
    if (ingredientId) {
      this.ingredient = (await this.loadIngredient(parseInt(ingredientId))) || undefined;
      if (this.ingredient?.nutrition) {
        this.calories = fixWholeNumber(this.ingredient.nutrition.nutrients.calories, 0);
        this.minerals = this.keyValuePair(this.ingredient.nutrition.minerals);
        this.vitamins = this.keyValuePair(this.ingredient.nutrition.vitamins);
      }

      if (this.ingredient) return;
    }

    // Redirect to the recipes list
    await firstValueFrom(timer(500));
    this.router.navigate([CRouteList.ingredients]);
  }

  async loadIngredient(itemId: number | undefined): Promise<null | IIngredient> {
    if (!itemId) {
      return null;
    }

    return await firstValueFrom(
      this.ingredientService.getIngredientById(itemId).pipe(
        catchError((error: unknown) => {
          const err = error as HttpErrorResponse;
          console.log('Error', err);
          return of(null);
        })
      )
    );
  }

  keyValuePair(data: IMinerals | IVitamins): IDisplayVitMin[] {
    return Object.entries(data)
      .map(([key, value]) => {
        if (!(key in CVitaminsMinerals)) return null;

        const nutrient = CVitaminsMinerals[key as keyof (IVitamins & IMinerals)];
        if (!nutrient) return null;

        return {
          value: fixWholeNumber(value, 2), // Round only if not an integer
          percentRda: parseFloat(((value / nutrient.rda) * 100).toFixed(1)), // Percentage of RDA
          name: nutrient.name,
          measure: nutrient.measure,
          shortName: nutrient.shortName
        };
      })
      .filter((nutrient) => nutrient !== null) // Remove nulls
      .sort((a, b) => b!.percentRda - a!.percentRda); // Sort by percentRda descending
  }

  backToIngredients() {
    this.router.navigate([CRouteList.ingredients]);
  }
}
