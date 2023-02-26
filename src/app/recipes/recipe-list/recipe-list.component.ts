import { Component } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent {
  recipes: Recipe[] = [
    new Recipe(
      'A test recipe',
      'this is simply a test',
      'https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/british_shakshuka_26737_16x9.jpg'
    ),
    new Recipe(
      'A test recipe',
      'this is simply a test',
      'https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/british_shakshuka_26737_16x9.jpg'
    ),
  ];
}
