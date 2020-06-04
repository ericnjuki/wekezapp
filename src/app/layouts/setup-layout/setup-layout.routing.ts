import { Routes } from '@angular/router';

import { AdminSetupComponent } from 'src/app/wekezapp/admin-setup/admin-setup.component';
import { AdminGuard } from 'src/app/services/admin-guard.service';

export const SetupLayoutRoutes: Routes = [
    { path: 'setup',          component: AdminSetupComponent, canActivate: [AdminGuard] }
];
