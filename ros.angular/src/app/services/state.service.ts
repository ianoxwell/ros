import { Injectable } from '@angular/core';
import { CBlankFilter, IFilter } from '@DomainModels/filter.dto';
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
  private recipeFilterQuery$ = new BehaviorSubject<IFilter>(CBlankFilter);
  private ingredientFilterQuery$ = new BehaviorSubject<IIngredientFilterObject>(new IngredientFilterObject());

  getRecipeFilterQuery(): Observable<IFilter> {
    return this.recipeFilterQuery$.asObservable();
  }

  setRecipeFilterQuery(query: IFilter): void {
    this.recipeFilterQuery$.next(query);
  }

  getIngredientFilterQuery(): Observable<IIngredientFilterObject> {
    return this.ingredientFilterQuery$.asObservable();
  }

  setIngredientFilterQuery(query: IIngredientFilterObject): void {
    this.ingredientFilterQuery$.next(query);
  }
}
