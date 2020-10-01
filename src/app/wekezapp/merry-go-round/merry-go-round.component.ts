import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/user.model';
import { ChamaService } from 'src/app/services/chama.service';
import { Chama } from 'src/app/shared/chama.model';
import { LedgerService } from 'src/app/services/ledger.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastOptions, ToastData, ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-merry-go-round',
  templateUrl: 'merry-go-round.component.html',
  styleUrls: ['./merry-go-round.component.css']
})

export class MerryGoRoundComponent implements OnInit {
  members = [];
  membersOrderList = [];
  chama = new Chama();
  dropdownToggle = true;
  disabledMgrMessage = '';
  disbursementSuccess = false;
  nextReceipient = 'Unknown';

  constructor(
    private chamaService: ChamaService,
    private userService: UserService,
    private ledgerService: LedgerService,
    private authService: AuthService,
    private toastyService: ToastyService
    // private route: ActivatedRoute,
    // private router: Router
  ) {}

  ngOnInit() {
    this.chamaService.getChama()
    .subscribe((chama: Chama) => {
      this.chama = chama;
      this.chama.mgrAmount = (+chama.mgrAmount).toLocaleString();
      this.disabledMgrMessage = 'Disabled until ' + this.getMgrDate(0, true) ;
      this.userService.getAllUsers()
        .subscribe( users => {
          const firstIndex = this.chama.nextMgrReceiverIndex;
          const index = [];

          for (let i = firstIndex; i < users.length; i++) {
            index.push(i);
          }
          for (let i = 0; i < firstIndex; i++) {
            index.push(i);
          }
          this.members = this.membersOrderList = index.map(i => <User>users[i]);
          this.nextReceipient = this.members[0].firstName;
      });
    });



  }

  getMgrDate(memberIndex, returnAsString = false) {
    let d = new Date(this.chama.nextMgrDate);
    // I'm not giving the user a choice of which DAY the payout happens (it's sunday)
    if (this.chama.period === 1) { // weekly
        // return dates as a function of index starting today

        // set date to the next sunday
        d.setDate(d.getDate() + (7 - d.getDay()) % 7);

        // return sunday based on your position in queue
        d.setDate(d.getDate() + memberIndex * 7);
        // set date to next sunday and return dates as a function of index starting then
    } else { // pay on the 1st of each month, always
        // set date to first day of next month
        d = new Date(d.getFullYear(), d.getMonth() + memberIndex + 1, 1);
    }
    return returnAsString ? d.toLocaleDateString() : d;
  }

  reorderNames(fromIndex, toIndex) {
    console.log('from: ' + fromIndex + ' to: ' + toIndex);

    // do a swap (since angular will swap them in the ui using this array anyway)
    [this.membersOrderList[toIndex], this.membersOrderList[fromIndex]] = [this.membersOrderList[fromIndex], this.membersOrderList[toIndex]];

    this.toggleDropdown('dropdown-content-mgr-name', toIndex);
  }

  saveMgrOrder() {
    this.chama.mgrOrder = [];
    for (let i = 0; i < this.membersOrderList.length; i++) {
      this.chama.mgrOrder.push(this.members[i].userId);
    }
    this.chamaService.updateChama(this.chama)
    .subscribe(res => {
      this.addToast('info', 'New order saved');
      console.log('MGR order updated!');
    },
    err => {
      this.addToast('error', err);
    });
  }

  disburseMgr() {
    this.ledgerService.createMgr()
      .subscribe(mgr => {
        this.ledgerService.disburseMgr(mgr.transactionId)
          .subscribe(updatedMgr => {
            this.disbursementSuccess = true;
          });
      });
  }

  mgrDisabled() {
    const nextMgrDate = new Date(this.chama.nextMgrDate);
    const today = new Date();
    let verdict = true;

    if (nextMgrDate <= today) {
      console.log(nextMgrDate.toLocaleDateString() + ' is in the past because today is ' + today.toLocaleDateString());
      console.log('so disabled needs to be false so we can click the disburse button');
      verdict = false;
    } else {
      console.log(nextMgrDate.toLocaleDateString() + ' is in the future because today is ' + today.toLocaleDateString());
      console.log('so disabled needs to be true until some time in the future');
      verdict = true;
    }
    return verdict;
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
