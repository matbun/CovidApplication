import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { HomePageComponent } from './home-page/home-page.component';
import { StatePageComponent } from './state-page/state-page.component';
import { AuthComponent } from './auth/auth.component';
import { NewsComponent } from './news/news.component';
import { AddNewsComponent } from './add-news/add-news.component';
import { DataVizComponent } from './data-viz/data-viz.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    StatePageComponent,
    AuthComponent,
    NewsComponent,
    AddNewsComponent,
    DataVizComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
