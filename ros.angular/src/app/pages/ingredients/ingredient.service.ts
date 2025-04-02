import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagedResult } from '@DomainModels/base.dto';
import { CBlankFilter, IFilter } from '@DomainModels/filter.dto';
import { IIngredient, IIngredientShort } from '@DomainModels/ingredient.dto';
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

  constructor(private httpClient: HttpClient) {}

  getIngredientList(filterQuery: IFilter): Observable<IPagedResult<IIngredient>> {
    if (!filterQuery) {
      filterQuery = CBlankFilter;
    }

    return this.httpClient.post<IPagedResult<IIngredient>>(`${this.apiUrl}ingredient/search`, filterQuery, {
      headers: this.defaultHeader
    });
  }

  getIngredientSuggestion(queryString: string): Observable<IIngredientShort[]> {
    return this.httpClient.get<IIngredientShort[]>(this.apiUrl + 'ingredient/suggestion' + queryString, {
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

  checkFoodNameExists(filter: string, foodId = 0): Observable<boolean> {
    const queryStr = `?filter=${filter}&foodId=${foodId}`;
    return this.httpClient.get<boolean>(`${this.apiUrl}ingredient/check-name${queryStr}`);
  }
}
