import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/user.model';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  dropdownToggle = true;
  selectedLoanee = '<select member>';
  selectedAccountEditee = '<select member>';
  selectedPayoutee = '<select member>';
  roleText = '<select role>';

  accountEditeeAmount = 0;

  membersNamesList = [];
  members = [];
  newMembers = [];
  member: User = {};

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getAllUsers()
    .subscribe(users => {
      this.members = users;
      users.forEach(user => {
        this.membersNamesList.push({id: user.userId, name: user.firstName});
      });
    });
  }

  addNewMember() {
    if (this.roleText === '<select role>') {
      this.member.role = 'Member';
    }
    // this.member.firstName = this.name;
    // this.member.email = this.email;
    // this.member.balance = this.personalAmt;
    this.member.password = 'secure123';

    this.newMembers.push(this.member);
    this.userService.addUsers(this.newMembers).subscribe(res => {
      console.log(res);
      this.member = {};
      this.newMembers = [];
      this.roleText = '<select role>';

      this.userService.getAllUsers()
      .subscribe(users => {
        this.members = users;
        this.membersNamesList = [];
        users.forEach(user => {
          this.membersNamesList.push({id: user.userId, name: user.firstName});
        });
      });
    });
  }

  updateMemberAccountAmount() {
    if (this.selectedAccountEditee !== '<select member>') {
      this.members.forEach(member => {
        if (this.selectedAccountEditee === member.firstName) {
          this.userService.findById(member.userId)
            .subscribe(user => {
              const updatedUser = user;
              updatedUser.balance = this.accountEditeeAmount;
              this.userService.updateUser(updatedUser)
                .subscribe(res => {
                  console.log(res);
                  this.selectedAccountEditee = '<select member>';
                  this.accountEditeeAmount = 0;
                });
            });
        }
      });
    } else {
      console.log('Please select a member first');
    }
  }

  toggleDropdown(classOrId) {
    // this.dropdownToggle = true;
    const dropDownMenu = document.getElementsByClassName(classOrId);
    if (this.dropdownToggle) {
      dropDownMenu.item(0).setAttribute('style', 'display: block;');
    } else {
      dropDownMenu.item(0).setAttribute('style', 'display: none;');
    }
    this.dropdownToggle = this.dropdownToggle ? false : true;
  }

  selectNewMemberRole(role) {
    this.member.role = this.roleText = role;
    this.toggleDropdown('ddown-content-new-account-role');
  }

  selectLoanReceipient(receipientName) {
    this.selectedLoanee = receipientName;
    this.toggleDropdown('ddown-content-name-loan');
  }
  selectPayoutReceipient(receipientName) {
    this.selectedPayoutee = receipientName;
    this.toggleDropdown('ddown-content-name-payout');
  }
  selectUserWhoseAccountToEdit(receipientName) {
    this.selectedAccountEditee = receipientName;
    this.toggleDropdown('ddown-content-name-account-edit');
  }
}
