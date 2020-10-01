import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { addToast } from 'src/app/shared/ng.toasty';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  invalidLogin: boolean;
  email;
  password;
  recoveryCode;

  passwordRecovered: boolean;
  forgotPasswordFlag: boolean;
  codeSent: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastyService: ToastyService) {}

  ngOnInit() {
  }
  ngOnDestroy() {
  }

  login() {
    // console.log(this.email + ' ' + this.password);
    const loginToast = this.addToast('wait', 'Logging you in...', 10000);
    this.authService.login({email: this.email, password: this.password})
    .subscribe(result => {
      this.toastyService.clear(loginToast);
      this.addToast('success', 'Login Successful!', 1000);
      console.log(result);
      if (result) {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigate([returnUrl || '/']);
      } else {
        console.log('hit me?');
        this.invalidLogin = true;
      }
    }, err => {
      this.invalidLogin = true;
    });
  }

  sendRecoveryCode() {
    this.authService.sendRecoveryCode(this.email)
      .subscribe(res => {
        this.codeSent = true;
        console.log(res);
      });
  }

  recoverPassword() {
    this.authService.recoverPassword(this.email, this.recoveryCode)
      .subscribe(res => {
        this.passwordRecovered = true;
        console.log(res);
      });
  }

  forgotPassword() {
    this.forgotPasswordFlag = true;
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
