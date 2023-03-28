import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  redirectLoggedInTo,
  redirectUnauthorizedTo,
  canActivate,
  AuthGuard
}from '@angular/fire/auth-guard'

const redirectUnauthorizedToLogin = ()=> redirectUnauthorizedTo(['/login'])

const redirectLoggedInToHome= ()=> redirectLoggedInTo(['home'])

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
  //  canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    title:"FitFab Log in",
    
    
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
    title:"FitFab Sign Up"
  },
  {
    path: 'hometabs',
    loadChildren: () => import('./pages/hometabs/hometabs.module').then( m => m.HometabsPageModule)
  },
  
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
