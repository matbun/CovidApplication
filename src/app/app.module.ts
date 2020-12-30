import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { HomePageComponent } from './home-page/home-page.component';
import { StatePageComponent } from './state-page/state-page.component';
import { AuthComponent } from './auth/auth.component';
import { NewsComponent } from './news/news.component';
import { DataVizComponent } from './data-viz/data-viz.component';
import { ChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatTableModule} from '@angular/material/table'; 
import {MatSortModule} from '@angular/material/sort';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import { ReactiveFormsModule } from '@angular/forms';
import {MatListModule} from '@angular/material/list';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {  MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card'; 

import {MatPaginatorModule} from '@angular/material/paginator'; 

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    StatePageComponent,
    AuthComponent,
    NewsComponent,
    DataVizComponent,
    ManageUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ChartsModule,
    BrowserAnimationsModule,
    MatSortModule,
    MatTableModule,
    HttpClientModule,
    FormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
