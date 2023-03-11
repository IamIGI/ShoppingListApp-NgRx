import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent {
  ingredients: Ingredient[];
  private subscription = new Subscription();

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    //after change of ingredients array (added new ingredient), return new array
    this.subscription = this.shoppingListService.ingredientsChanged.subscribe(
      (ingredients) => {
        this.ingredients = ingredients;
      }
    );
  }

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index); // pass index to service, so you could listen (get the index) from other component
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
