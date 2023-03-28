import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HometabsPageRoutingModule } from './hometabs-routing.module';

import { HometabsPage } from './hometabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HometabsPageRoutingModule
  ],
  declarations: [HometabsPage]
})
export class HometabsPageModule {}
