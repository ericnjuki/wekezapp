import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  name = 'Eric Dev';
  email = 'ericwekezapp@gmail.com';
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
    const registerToast = this.addToast('wait', 'Opening account...', 10000);
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
          this.authService.login(
            {
              email: this.email,
              password: this.password
            }).
            subscribe(res => {
              this.toastyService.clear(registerToast);
              if (res) {
                this.addToast('success', 'Login Successful', 1000);
                this.router.navigate(['/setup'], {
                  queryParams: { adminUser: this.email }
                });
              } else {
                this.addToast('error', 'Error Logging in', 2000);
                console.log('login problems...');
              }
            });
        } else {
          this.addToast('error', 'Error registering, check server', 3000);
          console.log('not a 200, so problems');
        }
      }, err => {
        this.addToast('error', 'Error registering, check server', 3000);
        console.log(err);
      });
  }

  addToast(toastType: string, message: string, timeout = 3000) {
    let toastId;
    const toastOptions: ToastOptions = {
      title: '',
      onAdd: (toast: ToastData) => {
        toastId = toast.id;
      }
    };
    toastOptions.title = '';
    toastOptions.msg = message;
    toastOptions.theme = 'bootstrap';
    toastOptions.timeout = timeout;

    switch (toastType) {
      case 'wait':
        this.toastyService.wait(toastOptions);
        break;
      case 'info':
        this.toastyService.info(toastOptions);
        break;
      case 'success':
        this.toastyService.success(toastOptions);
        break;
      case 'warning':
        this.toastyService.warning(toastOptions);
        break;
      case 'error':
        this.toastyService.error(toastOptions);
        break;
      default:
        this.toastyService.default(toastOptions);
    }
    return toastId;
  }
}
