import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

export const ACTIONS = {
  ADD_INGREDIENT: 'ADD_INGREDIENT',
};

export class AddIngredient implements Action {
  readonly type = ACTIONS.ADD_INGREDIENT;
  payload: Ingredient;
}
