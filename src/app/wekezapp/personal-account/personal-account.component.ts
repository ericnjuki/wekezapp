import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from '../../variables/charts';
import { LedgerService } from 'src/app/services/ledger.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ChamaService } from 'src/app/services/chama.service';
import { Chama } from 'src/app/shared/chama.model';
import { User } from 'src/app/shared/user.model';
import { UserService } from 'src/app/services/user.service';
import { ToastOptions, ToastData, ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-personal-account',
  templateUrl: 'personal-account.component.html',
  styleUrls: ['./personal-account.component.css']
})
export class PersonalAccountComponent implements OnInit {
  depositAmt: any = '1050';
  withdrawalAmount: any = '1060';

  // contribution
  user: User;
  contAmt: any = '80';
  period = 1;
  contributionsOwed = 0;
  loansOwed = 0;
  amtInAccount = 0;

  // stats
  myNextPayoutDate: any = '01/01/0001';
  chama = new Chama();

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked = true;
  public clicked1 = false;

  constructor(
    private ledgerService: LedgerService,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private toastyService: ToastyService,
    private chamaService: ChamaService) { }

  ngOnInit() {
    const goto = this.route.snapshot.queryParamMap.get('goto');
    let idToGoTo = '';
    switch (goto) {
      case 'contributions':
        idToGoTo = 'panel-contributions';
        break;
      default:
        break;
    }

    this.chamaService.getChama()
      .subscribe((chama: Chama) => {
        // this.contAmt = chama.minimumContribution;
        this.chama = chama;
        this.period = chama.period;
        this.myNextPayoutDate = this.getMgrDate(chama.mgrOrder.indexOf(this.authService.currentUser.UserId), true);
      });

    this.userService.findById(this.authService.currentUser.UserId)
      .subscribe((user: User) => {
        console.log(user);
        this.contributionsOwed = user.outstandingContributions;
        this.loansOwed = user.outstandingLoans;
        this.amtInAccount = user.balance;
        this.user = user;
      });

    if (idToGoTo) {
      document.getElementById(idToGoTo).scrollIntoView();
    }
  }

  requestPersonalDeposit() {
    const depositAmtString = this.depositAmt;

    this.ledgerService.requestPersonalDeposit({
      DepositorId: this.authService.currentUser.UserId,
      Amount: +this.depositAmt.replace(/,/g, '')
    }).subscribe(res => {
      this.depositAmt = '0';
      this.addToast('info', 'You requested to have Ksh. ' + depositAmtString + ' deposited into your account');
      console.log(res);
    },
    err => {
      this.addToast('error', err);
    });
  }

  requestPersonalWithdrawal() {
    const withdrawalAmountString = this.withdrawalAmount;

    this.ledgerService.requestPersonalWithdrawal({
      WithdrawerId: this.authService.currentUser.UserId,
      Amount: this.withdrawalAmount.replace(/,/g, '')
    }).subscribe(res => {
      this.withdrawalAmount = '0';
      this.addToast('info', 'You requested to withdraw ' + withdrawalAmountString + ' from your account');
      console.log(res);
    },
    err => {
      this.addToast('error', err);
    });
  }

  payContribution() {
    const contAmtString = this.contAmt;

    const startWithOld = (<HTMLInputElement>document.querySelector('input[name="startWithOld"]:checked')).value;
    this.ledgerService.contributeToChama(+this.contAmt.replace(/,/g, ''), startWithOld)
      .subscribe((userWithNewOutstanding: User) => {
        this.contAmt = '0';
        this.addToast('success', 'Contribution of Ksh. ' + contAmtString + ' paid.');
        this.contributionsOwed = userWithNewOutstanding.outstandingContributions;
        this.amtInAccount = userWithNewOutstanding.balance;
        this.user = userWithNewOutstanding;
      },
      err => {
        this.addToast('error', err);
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

  amtChange() {
    this.depositAmt = +this.depositAmt.replace(/,/g, '');
    const n1 = this.depositAmt.toLocaleString();
    this.depositAmt = n1;

    this.withdrawalAmount = +this.withdrawalAmount.replace(/,/g, '');
    const n2 = this.withdrawalAmount.toLocaleString();
    this.withdrawalAmount = n2;

    this.contAmt = +this.contAmt.replace(/,/g, '');
    const n3 = this.contAmt.toLocaleString();
    this.contAmt = n3;

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
