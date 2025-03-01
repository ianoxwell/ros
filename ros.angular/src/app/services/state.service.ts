import { Injectable } from '@angular/core';
import { CBlankFilter, IFilter } from '@DomainModels/filter.dto';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  /** Todo add back in the recipe specific items */
  private recipeFilterQuery$ = new BehaviorSubject<IFilter>(CBlankFilter);
  private ingredientFilterQuery$ = new BehaviorSubject<IFilter>({ ...CBlankFilter, take: 25 });

  getRecipeFilterQuery(): Observable<IFilter> {
    return this.recipeFilterQuery$.asObservable();
  }

  setRecipeFilterQuery(query: IFilter): void {
    this.recipeFilterQuery$.next(query);
  }

  getIngredientFilterQuery(): Observable<IFilter> {
    return this.ingredientFilterQuery$.asObservable();
  }

  setIngredientFilterQuery(query: IFilter): void {
    this.ingredientFilterQuery$.next(query);
  }
}
