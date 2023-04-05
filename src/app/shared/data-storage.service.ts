import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs';
import { Store } from '@ngrx/store';
//Redux imports
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';

@Injectable({
  providedIn: 'root', //the same as adding in app.module.ts in providers
})
export class DataStorageService {
  URL =
    'https://shoppinglistapp-39626-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    private store: Store<fromApp.AppState>
  ) {}

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http.put(this.URL, recipes).subscribe((response) => {
      console.log(response);
    });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.URL).pipe(
      map((recipes) => {
        return recipes.map((recipe) => {
          //check if object contain recipe ingredients
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => {
        // this.recipesService.setRecipes(recipes);
        this.store.dispatch(new RecipesActions.SetRecipes(recipes));
      }) //tap - allow to execute some logic
    );
  }
}
