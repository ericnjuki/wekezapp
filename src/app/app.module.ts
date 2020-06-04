import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SetupLayoutComponent } from './layouts/setup-layout/setup-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { HttpModule } from '@angular/http';
import { ChamaService } from './services/chama.service';
import { UserService } from './services/user.service';
import { AdminGuard } from './services/admin-guard.service';
import { LedgerService } from './services/ledger.service';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    SetupLayoutComponent,
  ],
  providers: [AuthGuard, AdminGuard, AuthService, ChamaService, UserService, LedgerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
