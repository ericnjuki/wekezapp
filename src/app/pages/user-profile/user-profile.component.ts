import { Component, OnInit } from '@angular/core';
import { ChamaService } from 'src/app/services/chama.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  chama = this.chamaService.getChama();
  user = this.userService.findById(this.authService.currentUser.UserId);

  userEmail = this.authService.currentUser.Email;
  userFirstName = this.authService.currentUser.FirstName;
  userSecondName = this.authService.currentUser.SecondName;

  constructor(
    private chamaService: ChamaService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.userService.findById(this.authService.currentUser.UserId).subscribe(res => console.log(res));
    // this.user.subscribe(res => console.log(res));
  }

  saveChanges() {
    if (
      this.userEmail !== this.authService.currentUser.Email ||
      this.userFirstName !== this.authService.currentUser.FirstName ||
      this.userSecondName !== this.authService.currentUser.SecondName
    ) {
      this.user.subscribe((userObj) => {
        const newUserDetails: User = userObj;
        newUserDetails.email = this.userEmail;
        newUserDetails.firstName = this.userFirstName;
        newUserDetails.secondName = this.userSecondName;
        this.userService.updateUser(newUserDetails).subscribe((res) => {
          alert('Please login again with new credentials');
          this.authService.logout('user-profile');
        });
      });
    } else {
      console.log('nothings changed');
    }
  }
}
