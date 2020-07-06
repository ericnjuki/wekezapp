import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  invalidLogin: boolean;
  email;
  password;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) {}

  ngOnInit() {
  }
  ngOnDestroy() {
  }

  login() {
    // console.log(this.email + ' ' + this.password);
    this.authService.login({email: this.email, password: this.password}).subscribe(result => {
      if (result) {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigate([returnUrl || '/']);
      } else {
        this.invalidLogin = true;
      }
    });
  }

}
