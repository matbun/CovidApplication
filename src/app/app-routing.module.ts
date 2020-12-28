import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { HomePageComponent } from './home-page/home-page.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { StatePageGuard } from './state-page.guard';
import { StatePageComponent } from './state-page/state-page.component';

const routes: Routes = [
  {path: "home-page", component: HomePageComponent},
  {path: "state-page", component: StatePageComponent, canActivate: [StatePageGuard]},
  {path: "manage-users", component: ManageUsersComponent, canActivate: [AdminGuard]},
  {path: "", pathMatch: "full", redirectTo: "home-page"},
  {path: "**", redirectTo: "home-page"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
