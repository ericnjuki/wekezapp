import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import * as jdenticon from 'node_modules/jdenticon';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/loans', title: 'Loans',  icon: 'ni-books text-primary', class: '' },
    { path: '/personal', title: 'Personal Account',  icon: 'ni-briefcase-24 text-blue', class: '' },
    { path: '/mgr', title: 'Merry Go Round',  icon: 'ni-money-coins text-orange', class: '' },
    { path: '/user-profile', title: 'User profile',  icon: 'ni-single-02 text-yellow', class: '' },
    { path: '/admin', title: 'Admin Tools',  icon: 'ni-badge text-green', class: '' },
    // { path: '/tables', title: 'Tables',  icon: 'ni-bullet-list-67 text-red', class: '' },
    // { path: '/icons', title: 'Icons',  icon: 'ni-planet text-blue', class: '' },
    // { path: '/login', title: 'Login',  icon: 'ni-key-25 text-info', class: '' },
    // { path: '/register', title: 'Register',  icon: 'ni-circle-08 text-pink', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => {
      if (!this.authService.currentUserIsAdmin) {
        if (menuItem.path === '/admin') {
          return null;
        }
      }
      return menuItem;
    });
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
   document.getElementById('wp-navbar-icon-sidebar').setAttribute('data-jdenticon-value', this.authService.currentUser.UserId);
    // jdenticon();
  }

  logout() {
    this.authService.logout();
  }
}
