import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './services/auth-guard.service';
import { SetupLayoutComponent } from './layouts/setup-layout/setup-layout.component';

const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        loadChildren:
          './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren:
          './layouts/auth-layout/auth-layout.module#AuthLayoutModule'
      }
    ]
  },
  {
    path: '',
    component: SetupLayoutComponent,
    children: [
      {
        path: '',
        loadChildren:
          './layouts/setup-layout/setup-layout.module#SetupLayoutModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: []
})
export class AppRoutingModule {}
