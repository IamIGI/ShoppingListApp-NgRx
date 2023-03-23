import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' }, //only redirect when path is exactly the same
  {
    path: 'recipes',
    loadChildren: () =>
      import('./recipes/recipes.module').then(
        (module) => module.RecipesModules
      ),
  },
  {
    path: 'shopping-list',
    loadChildren: () =>
      import('./shopping-list/shopping-list.module').then(
        (module) => module.ShoppingListModule
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((module) => module.AuthModule),
  }, //lazy loading example
];

//transform class to angular module
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
    //Preloading loads other modules when user do not require from app to download another data
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
