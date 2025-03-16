import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Suggestion } from '@models/suggestion';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IRecipe, IRecipeShort } from '@DomainModels/recipe.dto';
import { IFilter } from '@DomainModels/filter.dto';
import { IPagedResult } from '@DomainModels/base.dto';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private defaultHeader = new HttpHeaders()
    .set('Content-Type', 'application/json;odata=verbose')
    .set('Accept', 'application/json;odata=verbose');
  private apiUrl = environment.apiUrl + environment.apiVersion;

  constructor(private httpClient: HttpClient) {}
  public getRecipe(filterQuery: IFilter | null): Observable<IPagedResult<IRecipeShort>> {
    // if (!filterQuery) {
    //   filterQuery = new RecipeFilterQuery();
    // }

    // sanity checks
    // if (!filterQuery.perPage || filterQuery.perPage < 1) {
    //   filterQuery.perPage = 25;
    // }

    // if (filterQuery.page < 0) {
    //   filterQuery.page = 0;
    // }

    // let queryString = `?pageSize=${filterQuery.perPage}&page=${filterQuery.page * filterQuery.perPage}&sort=${
    //   filterQuery.orderby
    // }&`;
    // if (filterQuery.order) {
    //   queryString += `order=${filterQuery.order}`;
    // }

    // if (filterQuery.name) {
    //   queryString += `filter=${filterQuery.name}&`;
    // }

    // queryString = queryString.slice(0, -1);
    console.log('ready the query', filterQuery);
    return this.httpClient.post<IPagedResult<IRecipe>>(`${this.apiUrl}recipe/search`, filterQuery, {
      headers: this.defaultHeader
    });
  }

  // don't currently have this - but good idea
  public getRecipeRandom(): Observable<IRecipe> {
    return this.httpClient.get<IRecipe>(`${this.apiUrl}recipe/random`, {
      headers: this.defaultHeader
    });
  }

  public getRecipeSuggestion(queryString: string): Observable<Suggestion[]> {
    return this.httpClient.get<Suggestion[]>(`${this.apiUrl}recipe/suggestion${queryString}`, {
      headers: this.defaultHeader
    });
  }

  /** Checks that the name exists, returns true if the name is available */
  public checkRecipeNameExists(filter: string, foodId = 0): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.apiUrl}recipe/check-name?name=${filter}`);
  }

  public getRecipeById(itemId: number): Observable<IRecipe> {
    return this.httpClient.get<IRecipe>(`${this.apiUrl}recipe/${itemId}`, {
      headers: this.defaultHeader
    });
  }

  public createRecipe(newItem: IRecipe): Observable<IRecipe> {
    return this.httpClient.post<IRecipe>(`${this.apiUrl}recipe`, newItem, {
      headers: this.defaultHeader
    });
  }

  public updateRecipe(updateItem: IRecipe): Observable<IRecipe> {
    return this.httpClient.post<IRecipe>(`${this.apiUrl}recipe`, updateItem, { headers: this.defaultHeader });
  }

  public deleteRecipe(itemID: string): Observable<IRecipe> {
    return this.httpClient.delete<IRecipe>(`${this.apiUrl}recipe/${itemID}`, {
      headers: this.defaultHeader
    });
  }
}
