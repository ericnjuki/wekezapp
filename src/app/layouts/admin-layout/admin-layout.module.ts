import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MerryGoRoundComponent } from 'src/app/wekezapp/merry-go-round/merry-go-round.component';
import { PersonalAccountComponent } from 'src/app/wekezapp/personal-account/personal-account.component';
import { LoansComponent } from 'src/app/wekezapp/loans/loans.component';
import { AdminPanelComponent } from 'src/app/wekezapp/admin-panel/admin-panel.component';
import { ToastyModule } from 'ng2-toasty';
// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    MerryGoRoundComponent,
    PersonalAccountComponent,
    LoansComponent,
    AdminPanelComponent,
  ]
})

export class AdminLayoutModule {}
