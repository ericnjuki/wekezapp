import { Component, OnInit } from '@angular/core';
import { ChamaService } from 'src/app/services/chama.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/user.model';
import { Router } from '@angular/router';
import * as jdenticon from 'node_modules/jdenticon';
import { ToastOptions, ToastData, ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  chama = this.chamaService.getChama();
  user = this.userService.findById(this.authService.currentUser.UserId);
  chamaName = '<unkown>';

  userEmail = this.authService.currentUser.Email;
  userFirstName = this.authService.currentUser.FirstName;
  userSecondName = this.authService.currentUser.SecondName;
  userPassword = '';

  constructor(
    private chamaService: ChamaService,
    private authService: AuthService,
    private userService: UserService,
    private toastyService: ToastyService,
    private router: Router
  ) {}

  ngOnInit() {
    document.getElementById('wp-profile-icon').setAttribute('data-jdenticon-value', this.authService.currentUser.UserId);
    jdenticon();
    // this.userService.findById(this.authService.currentUser.UserId).subscribe(res => console.log(res));
    // this.user.subscribe(res => console.log(res));
  }

  saveChanges() {
    if (
      this.userEmail !== this.authService.currentUser.Email ||
      this.userFirstName !== this.authService.currentUser.FirstName ||
      this.userPassword !== ''
      //  || this.userSecondName !== this.authService.currentUser.SecondName
    ) {
      this.user.subscribe((userObj) => {
        const newUserDetails: User = userObj;
        newUserDetails.email = this.userEmail;
        newUserDetails.firstName = this.userFirstName;
        newUserDetails.password = this.userPassword;
        // newUserDetails.secondName = this.userSecondName;
        this.userService.updateUser(newUserDetails).subscribe((res) => {
          this.addToast('success', 'Saved!');
          alert('Please login again with new credentials');
          this.authService.logout('user-profile');
        },
        err => {
          this.addToast('error', err);
        });
      });
    } else {
      this.addToast('info', 'nothing to save!');
      console.log('nothings changed');
    }
  }

  getFirstWord(str) {
    const spaceIndex = str.indexOf(' ');
    return spaceIndex === -1 ? str : str.substr(0, spaceIndex);
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
