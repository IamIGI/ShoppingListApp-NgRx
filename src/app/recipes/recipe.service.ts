import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
  recipesChange = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'A test recipe1',
  //     'this is simply a test1',
  //     'https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/british_shakshuka_26737_16x9.jpg',
  //     [new Ingredient('Meat', 1), new Ingredient('French Fries', 100)]
  //   ),
  //   new Recipe(
  //     'A test recipe2',
  //     'this is simply a test2',
  //     'https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/british_shakshuka_26737_16x9.jpg',
  //     [
  //       new Ingredient('Buns', 2),
  //       new Ingredient('Meat', 1),
  //       new Ingredient('Salad', 3),
  //       new Ingredient('Cheese', 2),
  //     ]
  //   ),
  // ];
  private recipes: Recipe[] = [];

  constructor(private shoppingListService: ShoppingListService) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.refreshRecipesData();
  }

  getRecipes() {
    return this.recipes.slice(); // just for returning the copy of object
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.refreshRecipesData();
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.refreshRecipesData();
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.refreshRecipesData();
  }

  refreshRecipesData() {
    this.recipesChange.next(this.recipes.slice());
  }
}
