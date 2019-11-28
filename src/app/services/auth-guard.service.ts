import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route, state: RouterStateSnapshot) {
    if (this.authService.isLoggedIn()) { console.log('logged in'); return true; }

    console.log('not logged in');
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url}});
    return false;
  }
}
