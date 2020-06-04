import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup-layout',
  templateUrl: './setup-layout.component.html',
  styleUrls: ['./setup-layout.component.scss']
})
export class SetupLayoutComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    const html = document.getElementsByTagName('html')[0];
    html.classList.add('auth-layout');
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('bg-default');
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });

  }
  ngOnDestroy() {
    const html = document.getElementsByTagName('html')[0];
    html.classList.remove('auth-layout');
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('bg-default');
  }
}
