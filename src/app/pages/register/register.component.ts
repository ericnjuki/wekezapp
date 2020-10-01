import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { AuthService } from 'src/app/services/auth.service';
import { addToast } from 'src/app/shared/ng.toasty';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  name = 'Fred Makoha';
  email = 'a@b.c';
  password = '1234';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastyService: ToastyService
  ) {}

  ngOnInit() {}

  register() {
    // console.log(this.username + ' ' + this.password);
    const registerToast = addToast('wait', 'Opening account...', 10000);
    this.authService
      .register({
        firstName: this.name,
        email: this.email,
        password: this.password,
        role: 'Admin',
      })
      // .subscribe({
      //   next: result => {
      //       // console.log(result);
      //       this.router.navigate(['/setup'], {
      //         queryParams: { adminUser: this.username || 'admin' }
      //       });
      //   },
      //   error: err => console.error('Problems registering: ' + err),
      //   complete: () => console.log('Registration complete?'),
      // });

      .subscribe(result => {
        if (result) {
          this.toastyService.clear(registerToast);
          const loginToast = addToast('wait', 'Logging you in...', 10000);
          this.authService.login(
            {
              email: this.email,
              password: this.password
            }).
            subscribe(res => {
              this.toastyService.clear(loginToast);
              if (res) {
                addToast('success', 'Login Successful', 1000);
                this.router.navigate(['/setup'], {
                  queryParams: { adminUser: this.email }
                });
              } else {
                addToast('error', 'Error Logging in', 2000);
                console.log('login problems...');
              }
            });
        } else {
          addToast('error', 'Error registering, check server', 3000);
          console.log('not a 200, so problems');
        }
      }, err => {
        addToast('error', 'Error registering, check server', 3000);
        console.log(err);
      });
  }
}
