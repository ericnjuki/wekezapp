import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/user.model';
import { LedgerService } from 'src/app/services/ledger.service';
import { Chama } from 'src/app/shared/chama.model';
import { ChamaService } from 'src/app/services/chama.service';
import { ToastOptions, ToastData, ToastyService } from 'ng2-toasty';
import { User2 } from 'src/app/shared/user2.model';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  dropdownToggle = true;
  membersNamesList = [];

  // new member
  roleText = '<select role>';
  members = [];
  newMembers = [];
  member: User2 = {
    balance2 : '1000'
  };

  // edit account balance
  selectedAccountEditee = '<select member>';
  accountEditeeAmount: any = '0';

  // chama deposit
  chamaDepositAmount: any = '20000';

  // chama withdrawal
  chamaWithdrawalAmount: any = '10000';

  // payout
  selectedPayoutee = '<select member>';
  chamaBalance = 0;
  payoutAmount: any = '555';

  constructor(private userService: UserService,
    private ledgerService: LedgerService,
    private toastyService: ToastyService,
    private chamaService: ChamaService) { }

  ngOnInit() {
    this.userService.getAllUsers()
    .subscribe(users => {
      for(let i = 0; i < users.length; i++) {
        users[i] = this.toCamel(users[i]);
      }
      this.members = users;
      this.members.forEach(user => {
        this.membersNamesList.push({id: user.userId, name: user.firstName});
      });
    });

    this.chamaService.getChama()
    .subscribe((chama: Chama) => {
      this.chamaBalance = chama.balance;
    });
  }

  addNewMember() {
    if (this.roleText === '<select role>') {
      this.member.role = 'Member';
    }
    // this.member.firstName = this.name;
    // this.member.email = this.email;
    // this.member.balance2 = this.personalAmt;
    this.member.password = 'secure123';

    this.newMembers.push(this.member);
    this.userService.addUsers(this.newMembers).subscribe(res => {
      this.addToast('success', 'New member added!');
      this.member = {};
      this.newMembers = [];
      this.roleText = '<select role>';

      this.userService.getAllUsers()
      .subscribe(users => {
        for(let i = 0; i < users.length; i++) {
          users[i] = this.toCamel(users[i]);
        }
        this.members = users;
        this.membersNamesList = [];
        this.members.forEach(user => {
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
              updatedUser.balance = +this.accountEditeeAmount.replace(/,/g, '');
              this.userService.updateUser(updatedUser)
                .subscribe(res => {
                  this.addToast('info', 'Account information updated');
                  this.selectedAccountEditee = '<select member>';
                  this.accountEditeeAmount = '0';
                });
            });
        }
      });
    } else {
      console.log('Please select a member first');
    }
  }

  payout() {
    if (this.selectedPayoutee !== '<select member>') {
      this.members.forEach(member => {
        if (this.selectedPayoutee === member.firstName) {
          this.ledgerService.payout(member.userId, +this.payoutAmount.replace(/,/g, ''))
            .subscribe(user => {
              this.payoutAmount = '0';
              this.addToast('success', 'Transaction successful');
              this.chamaService.getChama()
                .subscribe((chama: Chama) => {
                  this.chamaBalance = chama.balance;
                  this.selectedPayoutee = '<select member>';
                });
            });
        }
      });
    } else {
      console.log('Please select a member first');
    }
  }

  requestChamaDeposit() {
    this.ledgerService.requestChamaDeposit({
      Amount: +this.chamaDepositAmount.replace(/,/g, '')
    }).subscribe(res => {
      this.chamaDepositAmount = '0';
      this.addToast('info', 'Request sent');
    }, err => {
      this.addToast('error', err);
    });
  }

  requestChamaWithdrawal() {
    this.ledgerService.requestChamaWithdrawal({
      Amount: +this.chamaWithdrawalAmount.replace(/,/g, '')
    }).subscribe(res => {
      this.chamaWithdrawalAmount = '0';
      this.addToast('info', 'Request sent');
    }, err => {
      this.addToast('error', err);
    });
  }

  createContributions() {
    this.ledgerService.createContributions()
      .subscribe(res => {
        this.addToast('success', 'Contribtuions created');
      },
      err => {
        this.addToast('error', err);
      });
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
  selectPayoutReceipient(receipientName) {
    this.selectedPayoutee = receipientName;
    this.toggleDropdown('ddown-content-name-payout');
  }
  selectUserWhoseAccountToEdit(receipientName) {
    this.selectedAccountEditee = receipientName;
    this.toggleDropdown('ddown-content-name-account-edit');
  }

  amtChange() {
    this.member.balance2 = +this.member.balance2.replace(/,/g, '');
    const n1 = this.member.balance2.toLocaleString();
    this.member.balance2 = n1;

    this.accountEditeeAmount = +this.accountEditeeAmount.replace(/,/g, '');
    const n2 = this.accountEditeeAmount.toLocaleString();
    this.accountEditeeAmount = n2;

    this.chamaDepositAmount = +this.chamaDepositAmount.replace(/,/g, '');
    const n3 = this.chamaDepositAmount.toLocaleString();
    this.chamaDepositAmount = n3;

    this.chamaWithdrawalAmount = +this.chamaWithdrawalAmount.replace(/,/g, '');
    const n4 = this.chamaWithdrawalAmount.toLocaleString();
    this.chamaWithdrawalAmount = n4;

    this.payoutAmount = +this.payoutAmount.replace(/,/g, '');
    const n5 = this.payoutAmount.toLocaleString();
    this.payoutAmount = n5;
  }

  toCamel(o) {
    var newO, origKey, newKey, value
    if (o instanceof Array) {
      return o.map(function(value) {
          if (typeof value === "object") {
            value = this.toCamel(value)
          }
          return value
      })
    } else {
      newO = {}
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
          value = o[origKey]
          if (value instanceof Array || (value !== null && value.constructor === Object)) {
            value = this.toCamel(value)
          }
          newO[newKey] = value
        }
      }
    }
    return newO
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
