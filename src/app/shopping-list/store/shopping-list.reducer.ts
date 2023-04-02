import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

const initialState = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
};

export function shoppingListReducer(
  state = initialState,
  action: ShoppingListActions.AddIngredient
) {
  switch (action.type) {
    case ShoppingListActions.ACTIONS.ADD_INGREDIENT:
      return {
        ...state, //well there is nothing cos we have just ingredients in there, but it's a good practice to always get the previous state
        ingredients: [...state.ingredients, action.payload],
      };
    default:
      return state;
  }
}
