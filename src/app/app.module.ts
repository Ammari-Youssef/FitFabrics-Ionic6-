import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//FireBase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import {FirestoreModule} from '@angular/fire/firestore'

import { environment } from 'src/environments/environment';

//API
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
//Mes guards 
import { AuthGuard } from './guards/auth.guard';
import { AuthentificationService } from './shared/authentification.service';



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FirestoreModule,
    CommonModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthGuard,
    AuthentificationService,
  ],
  bootstrap: [AppComponent],
  //  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class AppModule {}
