import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];

  getIngredients() {
    //to return copy of object just slice() which side effect is that, it is returning copy of object;
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.refreshIngredientsList();
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.refreshIngredientsList();
  }

  deleteIngredient(index: number) {
    if (!isNaN(index)) {
      this.ingredients.splice(index, 1);
      this.refreshIngredientsList();
    }
  }

  refreshIngredientsList() {
    this.ingredientsChanged.next(this.ingredients.slice()); // emit new ingredient array and save it to ingredientChanged
  }
}
