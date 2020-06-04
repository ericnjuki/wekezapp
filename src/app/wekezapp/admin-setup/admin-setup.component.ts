import { Component, OnInit } from '@angular/core';
import { ChamaService } from 'src/app/services/chama.service';
import { Chama } from 'src/app/shared/chama.model';
import { User } from 'src/app/shared/user.model';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-setup',
  templateUrl: './admin-setup.component.html',
  styleUrls: ['./admin-setup.component.scss']
})
export class AdminSetupComponent implements OnInit {
  setupStepNumber = 4;

  chamaDto: Chama = new Chama();
  members: User[] = [];
  member: User = {};

  // step 1 (chama general)
  chamaName = 'The Cobras';

  // step 2 (members + info)
  dropdownToggle = true;
  roleText = '<Role>';
  name = 'Jane Doe';
  email = 'ericnjuki@gmail.com';
  personalAmt = 1000.25;
  totalAmt = 0;

  // step 3 (contributions)
  // period = 2;
  minContribution = 200;
  contFine = 50;

  constructor(
    private chamaService: ChamaService,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const usr = this.route.snapshot.queryParamMap.get('adminUser');
    // this.userService.findByUsername(usr).subscribe((admin: User) => {
    //   console.log(admin);
    //   this.members.push(admin);
    // });
  }

  proceed() {
    switch (this.setupStepNumber) {
      case 1:
        this.chamaDto.chamaName = this.chamaName;
        this.chamaService.createChama(this.chamaDto)
          .subscribe(res => {
            console.log('Created chama ' + this.chamaName);
          }, err => {
            console.log(err);
          });
        break;

      case 2:
        if (this.members[0].role === 'Admin') {
          this.members.splice(0, 1);
        }
        this.members.forEach(member => {
          member.stake = (member.balance / this.totalAmt) * 100;
        });
        this.userService.addUsers(this.members).subscribe(res => {
          console.log(res);
        });
        this.members = [];
        break;

      case 3:
        const period = +(<HTMLInputElement>document.querySelector('input[name="Period"]:checked')).value;
        this.chamaService.getChama()
          .subscribe(res => {
            console.log('chama fetched:');
            console.log(res);
            this.chamaDto = res;
            this.chamaDto.period = period;
            this.chamaDto.minimumContribution = this.minContribution;
            this.chamaDto.fineRate = this.contFine;
            this.chamaService.updateChama(this.chamaDto)
              .subscribe(() => {
                console.log('chama contribution details updated');
              });
          });

        // prepping for the next step
        this.userService.getAllUsers()
          .subscribe( res => {
            this.members = <User[]>res;
          });
        break;

      case 4:
        this.chamaService.getChama()
        .subscribe(chama => {
          this.chamaDto = chama;
          this.chamaDto.mgrOrder = [];
          for (let i = 0; i < this.members.length; i++) {
            this.chamaDto.mgrOrder.push(this.members[i].userId);
          }
          this.chamaDto.setupComplete = true;

          this.chamaService.updateChama(this.chamaDto)
            .subscribe(res => {
              console.log('MGR order updated, and setup is complete');
              this.router.navigate(['/dashboard' || '/']);
          });
        });


        break;
    }
    this.setupStepNumber++;
  }

  addMember() {
    if (this.roleText === '<Role>') {
      this.member.role = 'Member';
    }
    this.member.firstName = this.name;
    this.member.email = this.email;
    this.member.password = 'secure123';
    this.member.balance = this.personalAmt;
    this.totalAmt += this.personalAmt;
    this.members.push(this.member);
    console.log(this.member);
    // this.dummyField = '';
    this.member = {};
    this.roleText = '<Role>';
  }
  removeMember(memberIndex) {
    this.members.splice(memberIndex, 1);
  }

  toggleDropdown(classOrId, dropItemIndex) {
    // this.dropdownToggle = true;
    const dropDownMenu = document.getElementsByClassName(classOrId);
    if (this.dropdownToggle) {
      dropDownMenu.item(dropItemIndex).setAttribute('style', 'display: block;');
    } else {
      dropDownMenu.item(dropItemIndex).setAttribute('style', 'display: none;');
    }
    this.dropdownToggle = this.dropdownToggle ? false : true;
  }

  setMemberRole(role: string) {
    this.member.role = this.roleText = role;
    this.toggleDropdown('dropdown-content-role', 0);
  }

  reorderNames(fromIndex, toIndex) {
    console.log('from: ' + fromIndex + ' to: ' + toIndex);

    // do a swap (since angular will swap them in the ui using this array anyway)
    [this.members[toIndex], this.members[fromIndex]] = [this.members[fromIndex], this.members[toIndex]];

    this.toggleDropdown('dropdown-content-name', toIndex);
  }

  getMGRDate(index) {
    let d = new Date();
    // I'm not giving the user a choice of which DAY the payout happens (it's sunday)
    if (this.chamaDto.period === 1) { // weekly
        // return dates as a function of index starting today

        // set date to the next sunday
        d.setDate(d.getDate() + (7 - d.getDay()) % 7);

        // return sunday based on your position in queue
        d.setDate(d.getDate() + index * 7);
        // set date to next sunday and return dates as a function of index starting then
    } else { // pay on the 1st of each month, always
        // set date to first day of next month
        d = new Date(d.getFullYear(), d.getMonth() + index + 1, 1);
    }
    return d.toLocaleDateString();
  }

  // skipSetup() {
  //   this.router.navigate(['/dashboard' || '/']);
  // }

  logout() {
    this.authService.logout();
  }

  // temp funcs
  loadUsers() {
    this.userService.getAllUsers()
    .subscribe( res => {
      this.members = <User[]>res;
    });
  }
}
