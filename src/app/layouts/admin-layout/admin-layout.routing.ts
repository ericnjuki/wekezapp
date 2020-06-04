import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { MerryGoRoundComponent } from 'src/app/wekezapp/merry-go-round/merry-go-round.component';
import { PersonalAccountComponent } from 'src/app/wekezapp/personal-account/personal-account.component';
import { LoansComponent } from 'src/app/wekezapp/loans/loans.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'mgr',            component: MerryGoRoundComponent},
    { path: 'personal',       component: PersonalAccountComponent},
    { path: 'loans',          component: LoansComponent}
];
