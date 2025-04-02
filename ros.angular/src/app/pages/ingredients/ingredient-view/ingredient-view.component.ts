import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CRouteList } from '@services/navigation/route-list.const';
import { catchError, firstValueFrom, of, timer } from 'rxjs';
import { IngredientService } from '../ingredient.service';
import { IIngredient } from '@DomainModels/ingredient.dto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ingredient-view',
  standalone: false,
  templateUrl: './ingredient-view.component.html',
  styleUrl: './ingredient-view.component.scss'
})
export class IngredientViewComponent implements OnInit {
  ingredient: IIngredient | undefined;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ingredientService: IngredientService
  ) {}

  async ngOnInit() {
    const ingredientId = this.route.snapshot.paramMap.get('ingredientId');
    if (ingredientId) {
      this.ingredient = (await this.loadIngredient(parseInt(ingredientId))) || undefined;
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

  backToIngredients() {
    this.router.navigate([CRouteList.ingredients]);
  }
}
