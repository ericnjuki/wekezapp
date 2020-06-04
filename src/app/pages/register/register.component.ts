import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  name = 'Fred Makoha';
  username = 'fred';
  email = 'a@b.c';
  password = '1234';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  register() {
    // console.log(this.username + ' ' + this.password);
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
          this.authService.login(
            {
              email: this.email,
              password: this.password
            }).
            subscribe(res => {
              if (res) {
                this.router.navigate(['/setup'], {
                  queryParams: { adminUser: this.email }
                });
              } else {
                console.log('login problems...');
              }
            });
        } else {
          console.log('not a 200, so problems');
        }
      }, err => {
        console.log(err);
      });
  }
}
