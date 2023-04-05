import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as RecipesActions from './recipe.actions';
import { map, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';

//allow inject args to this class
@Injectable()
export class RecipeEffects {
  URL =
    'https://shoppinglistapp-39626-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';

  fetchRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() => {
        return this.http.get<Recipe[]>(this.URL);
      }),
      map((recipes) => {
        return recipes.map((recipe) => {
          //check if object contain recipe ingredients
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      map((recipes) => {
        return new RecipesActions.SetRecipes(recipes);
      })
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
