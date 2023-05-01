import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HometabsPage } from './hometabs.page';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HometabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomePageModule),
        title: 'Home',
        // canActivate: [AuthGuard],
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('../cart/cart.module').then((m) => m.CartPageModule),
        title: 'Cart',
      },
      {
        path: 'aboutme',
        loadChildren: () =>
          import('../account/account.module').then((m) => m.AccountPageModule),
        title: 'Settings',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'hometabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HometabsPageRoutingModule {}
