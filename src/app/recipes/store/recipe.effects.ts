import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as RecipesActions from './recipe.actions';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';

import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

//allow inject args to this class
@Injectable()
export class RecipeEffects {
  URL =
    'https://shoppinglistapp-39626-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';

  fetchRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() => {
        const response = this.http.get<Recipe[]>(this.URL);
        return response;
      }),
      map((recipes) => {
        console.log(recipes);
        if (!recipes) recipes = [];
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

  storeRecipes = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([, recipesState]) => {
          return this.http.put(this.URL, recipesState.recipes);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
