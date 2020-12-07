import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { StatePageComponent } from './state-page/state-page.component';

const routes: Routes = [
  {path: "home-page", component: HomePageComponent},
  {path: "state-page", component: StatePageComponent},
  {path: "", pathMatch: "full", redirectTo: "home-page"},
  {path: "**", redirectTo: "home-page"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
