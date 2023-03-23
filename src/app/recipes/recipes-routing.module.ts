import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth/auth-guard.service';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipesResolverService } from './recipes-resolver.service';
import { RecipesComponent } from './recipes.component';

const routes: Routes = [
  {
    path: '', //when lazy loading is implemented, this path should be empty
    component: RecipesComponent,
    canActivate: [AuthGuardService],
    resolve: [RecipesResolverService], //resolvers will work before given url will be loaded
    children: [
      { path: '', component: RecipeStartComponent },
      { path: 'new', component: RecipeEditComponent },
      {
        path: ':id', //routes with dynamic parameters have to be after static urls
        component: RecipeDetailComponent,
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
