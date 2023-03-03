import { EventEmitter } from '@angular/core';
import { Recipe } from './recipe.model';

export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'A test recipe1',
      'this is simply a test1',
      'https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/british_shakshuka_26737_16x9.jpg'
    ),
    new Recipe(
      'A test recipe2',
      'this is simply a test2',
      'https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/british_shakshuka_26737_16x9.jpg'
    ),
  ];

  getRecipes() {
    return this.recipes.slice(); // just for returning the copy of object
  }
}
