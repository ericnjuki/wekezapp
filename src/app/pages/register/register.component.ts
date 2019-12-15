import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  name;
  email;
  password;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  register() {
    // console.log(this.username + ' ' + this.password);
    this.authService
      .register({ firstName: this.name, email: this.email, password: this.password, role: 'Admin', username: 'admin' })
      .subscribe(result => {
        if (result) {
          this.router.navigate(['/']);
        } else {
        }
      });
  }
}
