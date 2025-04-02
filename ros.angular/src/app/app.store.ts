import { computed, Injectable, signal } from '@angular/core';
import { IUserSummary } from '@DomainModels/user.dto';
import { IAllReferences } from '@DomainModels/reference.dto';
import { CBlankFilter, IIngredientFilter, IRecipeFilter } from '@DomainModels/filter.dto';
import { IRecipeShort } from '@DomainModels/recipe.dto';
import { IPagedResult } from '@DomainModels/base.dto';
import { CBlankPagedMeta } from '@models/common.model';
import { IIngredientShort } from '@DomainModels/ingredient.dto';

@Injectable({ providedIn: 'root' })
export class AppStore {
  private readonly state = {
    $user: signal<IUserSummary | null>(null),
    $loadingUser: signal<boolean>(false),
    $references: signal<IAllReferences | undefined>(undefined),
    $loadingReferences: signal<boolean>(false),
    $recipeFilter: signal<IRecipeFilter>(CBlankFilter),
    $recipes: signal<IPagedResult<IRecipeShort>>({ results: [], meta: CBlankPagedMeta }),
    $loadingRecipes: signal<boolean>(false),
    $ingredientFilter: signal<IIngredientFilter>({ ...CBlankFilter, take: 25 }),
    $ingredients: signal<IPagedResult<IIngredientShort>>({ results: [], meta: { ...CBlankPagedMeta, take: 25 } }),
    $loadingIngredients: signal<boolean>(false)
  } as const;

  public readonly $user = this.state.$user.asReadonly();
  public readonly $references = this.state.$references.asReadonly();
  public readonly $recipeFilter = this.state.$recipeFilter.asReadonly();
  public readonly $recipes = this.state.$recipes.asReadonly();
  public readonly $ingredients = this.state.$ingredients.asReadonly();
  public readonly $ingredientFilter = this.state.$ingredientFilter.asReadonly();
  public readonly $loading = computed<boolean>(
    () =>
      this.state.$loadingUser.asReadonly()() ||
      this.state.$loadingReferences.asReadonly()() ||
      this.state.$loadingRecipes.asReadonly()() ||
      this.state.$loadingIngredients.asReadonly()()
  );

  setUser(user: IUserSummary | null): void {
    this.state.$user.set(user);
  }
  setLoadingUser(isLoading: boolean): void {
    this.state.$loadingUser.set(isLoading);
  }

  setReferences(references: IAllReferences | undefined): void {
    this.state.$references.set(references);
  }

  setLoadingReferences(isLoading: boolean): void {
    this.state.$loadingReferences.set(isLoading);
  }

  setRecipeFilter(filter: IRecipeFilter) {
    this.state.$recipeFilter.set(filter);
  }

  setRecipeFilterTakeSize(take: number) {
    this.state.$recipeFilter.set({ ...this.$recipeFilter(), take });
  }

  setRecipes(result: IPagedResult<IRecipeShort>) {
    this.state.$recipes.set(result);
  }

  setLoadingRecipes(isLoading: boolean) {
    this.state.$loadingRecipes.set(isLoading);
  }

  setIngredientFilter(filter: IIngredientFilter) {
    this.state.$ingredientFilter.set(filter);
  }

  setIngredients(result: IPagedResult<IIngredientShort>) {
    this.state.$ingredients.set(result);
  }

  setLoadingIngredients(isLoading: boolean) {
    this.state.$loadingIngredients.set(isLoading);
  }
}
