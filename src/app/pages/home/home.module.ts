import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SearcharComponent } from 'src/app/components/searchar/searchar.component';
import { SearcharModule } from 'src/app/components/searchar/searchar.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SearcharModule
  ],
  declarations: [HomePage,SearcharComponent]
})
export class HomePageModule {}
