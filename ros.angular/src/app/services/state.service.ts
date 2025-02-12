import { Injectable } from '@angular/core';
import {
  IIngredientFilterObject,
  IngredientFilterObject,
  IRecipeFilterQuery,
  RecipeFilterQuery
} from '@models/filter-queries.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private recipeFilterQuery$ = new BehaviorSubject<IRecipeFilterQuery>(new RecipeFilterQuery());
  private ingredientFilterQuery$ = new BehaviorSubject<IIngredientFilterObject>(new IngredientFilterObject());

  getRecipeFilterQuery(): Observable<IRecipeFilterQuery> {
    return this.recipeFilterQuery$.asObservable();
  }

  setRecipeFilterQuery(query: IRecipeFilterQuery): void {
    this.recipeFilterQuery$.next(query);
  }

  getIngredientFilterQuery(): Observable<IIngredientFilterObject> {
    return this.ingredientFilterQuery$.asObservable();
  }

  setIngredientFilterQuery(query: IIngredientFilterObject): void {
    this.ingredientFilterQuery$.next(query);
  }
}
