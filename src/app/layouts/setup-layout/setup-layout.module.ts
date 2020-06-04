import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SetupLayoutRoutes } from './setup-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminSetupComponent } from 'src/app/wekezapp/admin-setup/admin-setup.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SetupLayoutRoutes),
    FormsModule
    // NgbModule
  ],
  declarations: [
    AdminSetupComponent
  ]
})
export class SetupLayoutModule { }
