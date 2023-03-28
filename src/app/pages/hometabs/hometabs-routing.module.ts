import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HometabsPage } from './hometabs.page';

const routes: Routes = [
  {
    path: '',
    component: HometabsPage,
    children:[
     {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule),
        title:"Home"
     },
     {
        path:'cart',
        loadChildren:()=> import('../cart/cart.module').then(m =>m.CartPageModule),
        title:'Cart'
     },
     {
        path:'aboutme',
        loadChildren:()=> import('../account/account.module').then(m=>m.AccountPageModule),
        title:"Settings"
     }
    ]
  },
  {
    path:"",
    redirectTo:"home",
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HometabsPageRoutingModule {}
