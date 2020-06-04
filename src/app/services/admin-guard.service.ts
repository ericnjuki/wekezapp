import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUser;
    if (currentUser.Role === 'Admin') {
      console.log('welcome mr./mrs. admin');
      return true;
    }

    console.log('not admin..');
    this.router.navigate(['/dashboard']);
    return false;
  }
}
