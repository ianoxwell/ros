import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagedResult } from '@DomainModels/base.dto';
import { CBlankFilter, IFilter } from '@DomainModels/filter.dto';
import { IIngredient } from '@DomainModels/ingredient.dto';
import {
  IRawFoodIngredient,
  IRawFoodSuggestion,
  ISpoonConversion,
  ISpoonFoodRaw,
  ISpoonSuggestions
} from '@models/raw-food-ingredient.model';
import { IRawReturnedRecipes } from '@models/spoonacular-recipe.model';
import { Suggestion } from '@models/suggestion';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private defaultHeader = new HttpHeaders()
    .set('Content-Type', 'application/json;odata=verbose')
    .set('Accept', 'application/json;odata=verbose');
  private apiUrl = environment.apiUrl + environment.apiVersion;
  private foodUrl = 'https://api.spoonacular.com';
  private foodApiKey = `8dc563dbb7eb4a7c8cf49c913d6fce36`;
  private static handleError(err: any): Promise<any> {
    console.error('Something has gone wrong', err.error);
    return Promise.reject(err.error || err);
  }
  constructor(private httpClient: HttpClient) {}

  getRandomSpoonacularRecipe(count: number): Observable<IRawReturnedRecipes> {
    return this.httpClient.get<IRawReturnedRecipes>(
      `${this.foodUrl}/recipes/random?limitLicense=true&number=${count}&apiKey=${this.foodApiKey}`,
      {
        headers: this.defaultHeader
      }
    );
  }
  getSpoonacularIngredient(ingredientID: string | number): Observable<ISpoonFoodRaw> {
    return this.httpClient.get<ISpoonFoodRaw>(
      `${this.foodUrl}/food/ingredients/${ingredientID}/information?amount=100&unit=grams&apiKey=${this.foodApiKey}`,
      { headers: this.defaultHeader }
    );
  }

  getSpoonacularSuggestions(foodName: string, limit = 5): Observable<ISpoonSuggestions[]> {
    const queryStr = `?query=${foodName}&number=${limit}&metaInformation=true`;
    return this.httpClient.get<ISpoonSuggestions[]>(
      `${this.foodUrl}/food/ingredients/autocomplete${queryStr}&apiKey=${this.foodApiKey}`,
      { headers: this.defaultHeader }
    );
  }

  getSpoonConversion(
    foodName: string,
    sourceUnit: string,
    sourceAmount: number,
    targetUnit: string
  ): Observable<ISpoonConversion> {
    const queryStr = `?ingredientName=${foodName}&sourceUnit=${sourceUnit}&sourceAmount=${sourceAmount}&targetUnit=${targetUnit}`;
    return this.httpClient.get<ISpoonConversion>(
      `${this.foodUrl}/recipes/convert${queryStr}&apiKey=${this.foodApiKey}`,
      {
        headers: this.defaultHeader
      }
    );
  }

  getIngredientList(filterQuery: IFilter): Observable<IPagedResult<IIngredient>> {
    if (!filterQuery) {
      filterQuery = CBlankFilter;
    }

    return this.httpClient.post<IPagedResult<IIngredient>>(`${this.apiUrl}ingredient/search`, filterQuery, {
      headers: this.defaultHeader
    });
  }

  getIngredientSuggestion(queryString: string): Observable<Suggestion[]> {
    return this.httpClient.get<Suggestion[]>(this.apiUrl + 'ingredient/suggestion' + queryString, {
      headers: this.defaultHeader
    });
  }
  getIngredientById(ingredientId: number): Observable<IIngredient> {
    return this.httpClient.get<IIngredient>(`${this.apiUrl}ingredient/${ingredientId}`, {
      headers: this.defaultHeader
    });
  }

  getIngredientByOtherId(id: number, searchField: 'linkUrl' | 'usdaFoodId'): Observable<IIngredient> {
    return this.httpClient.get<IIngredient>(`${this.apiUrl}ingredient/find?id=${id}&searchField=${searchField}`, {
      headers: this.defaultHeader
    });
  }
  createIngredient(ingredient: IIngredient): Observable<IIngredient> {
    return this.httpClient.post<IIngredient>(this.apiUrl + 'ingredient', ingredient, { headers: this.defaultHeader });
  }
  updateIngredient(ingredientId: number, update: any): Observable<IIngredient> {
    return this.httpClient.put<IIngredient>(`${this.apiUrl}ingredient/${ingredientId}`, update, {
      headers: this.defaultHeader
    });
  }
  deleteItem(itemID: number): Observable<IIngredient> {
    return this.httpClient.delete<IIngredient>(`${this.apiUrl}ingredient/${itemID}`, { headers: this.defaultHeader });
  }

  getRawFoodSuggestion(queryString: string, limit = 10, foodGroupId = 0): Observable<IRawFoodSuggestion[]> {
    let queryStr = `?filter=${queryString}&limit=${limit}`;
    if (foodGroupId > 0) {
      queryStr += `&foodGroupId=${foodGroupId}`;
    }
    return this.httpClient.get<IRawFoodSuggestion[]>(`${this.apiUrl}rawfooddata/suggestion${queryStr}`, {
      headers: this.defaultHeader
    });
  }

  getRawFoodById(usdaId: string): Observable<IRawFoodIngredient> {
    return this.httpClient.get<IRawFoodIngredient>(`${this.apiUrl}rawfooddata/${usdaId}`);
  }

  checkFoodNameExists(filter: string, foodId = 0): Observable<boolean> {
    const queryStr = `?filter=${filter}&foodId=${foodId}`;
    return this.httpClient.get<boolean>(`${this.apiUrl}ingredient/check-name${queryStr}`);
  }
}
