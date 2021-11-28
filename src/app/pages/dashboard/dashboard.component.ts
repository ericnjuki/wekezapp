import { Component, OnInit } from '@angular/core';
// import Chart from 'chart.js';

// core components
// import {
//   chartOptions,
//   parseOptions,
//   chartExample1,
//   chartExample2
// } from '../../variables/charts';
import { UserService } from 'src/app/services/user.service';
import { NotificationType } from 'src/app/shared/flow-type.enum';
import { LedgerService } from 'src/app/services/ledger.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/user.model';
import { ChamaService } from 'src/app/services/chama.service';
import { subscribeOn } from 'rxjs/operators';
import { Chama } from '../../../../src/app/shared/chama.model';
import { ToastOptions, ToastData, ToastyService } from 'ng2-toasty';
import { addToast } from 'src/app/shared/ng.toasty';
// import { stat } from 'fs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // stats
  loansOwed = 0;
  amtInAccount = 0;
  contributionsOwed = 0;
  user = new User();
  userStake = 0;
  owedByMe = this.contributionsOwed + this.loansOwed;

  // stats
  chama = new Chama();
  nextMgrReceiver = '';
  myNextPayoutDate: any = '01/01/0001';

  public datasets: any;
  public data: any;
  // public salesChart;
  public clicked = true;
  public clicked1 = false;

  private flowItems;

  constructor(
    private userService: UserService,
    private ledgerService: LedgerService,
    private authService: AuthService,
    private chamaService: ChamaService,
    private toastyService: ToastyService,
    private router: Router) { }

  ngOnInit() {
    this.processFlow();
    // this.flowItems = this.userService.getFlow();

    this.userService.findById(this.authService.currentUser.UserId)
    .subscribe((user: User) => {
      user = this.toCamel(user);

      this.contributionsOwed = user.outstandingContributions;
      this.loansOwed = user.outstandingLoans;
      this.amtInAccount = user.balance;
      this.user = user;
      this.userStake = user.stake;
    });

    this.chama.balance = 0;
    this.chamaService.getChama()
    .subscribe((chama: Chama) => {
      chama = this.toCamel(chama);

      chama.nextMgrDate = new Date(chama.nextMgrDate);
      this.chama = chama;

      this.myNextPayoutDate = this.getMgrDate(chama.mgrOrder.indexOf(this.authService.currentUser.UserId), true);
      this.userService.findById(chama.mgrOrder[chama.nextMgrReceiverIndex])
      .subscribe((user: User) => {
        user = this.toCamel(user);
        this.nextMgrReceiver = user.firstName;
      });
    });


    // this.datasets = [
    //   [0, 20, 10, 30, 15, 40, 20, 60, 60],
    //   [0, 20, 5, 25, 10, 30, 15, 40, 40]
    // ];
    // this.data = this.datasets[0];

    // const chartOrders = document.getElementById('chart-orders');

    // parseOptions(Chart, chartOptions());

    // const ordersChart = new Chart(chartOrders, {
    //   type: 'bar',
    //   options: chartExample2.options,
    //   data: chartExample2.data
    // });

    // const chartSales = document.getElementById('chart-sales');

    // this.salesChart = new Chart(chartSales, {
    //   type: 'line',
    //   options: chartExample1.options,
    //   data: chartExample1.data
    // });
  }

  processFlow() {
    this.userService.getFlow()
    .subscribe((res) => {

      for(let i = 0; i < res.length; i++) {
        res[i] = this.toCamel(res[i]);
        res[i].dateCreated = new Date(res[i].dateCreated.toString());
        res[i].dateModified = new Date(res[i].dateModified);
      };

      let flowItems = [];
      flowItems = res;
      flowItems.reverse();

      for (let i = 0; i < flowItems.length; i++) {
        // const dateCreated = new Date(flowItems[i].dateCreated);
        flowItems[i].newDateCreated = flowItems[i].dateCreated.toDateString();
        flowItems[i].newDateModified = flowItems[i].dateModified.toDateString();

        if (flowItems[i].isConfirmable) {
          switch (flowItems[i].notificationType) {
            case NotificationType.PersonalDepositAsAdmin:
            case NotificationType.PersonalWithdrawalAsWithdrawer:
            case NotificationType.DepositToChamaAsAdmin:
            case NotificationType.WithdrawFromChamaAsAdmin:
              if (flowItems[i].status === 'Unconfirmed') {
                flowItems[i].actionType = 'Confirm';
              } else {
                flowItems[i].actionType = 'Status';
              }
              break;

            case NotificationType.PersonalDepositAsDepositor:
              flowItems[i].actionType = 'Status';
              break;

            case NotificationType.PersonalWithdrawalAsAdmin:
              flowItems[i].actionType = 'Status';
              break;

            case NotificationType.LoanRequestAsAdmin:
              if (flowItems[i].status === 'Pending') {
                flowItems[i].actionType = 'Approve Reject';
              } else {
                flowItems[i].actionType = 'Status';
              }
              break;

            case NotificationType.LoanRequestAsRequester:
              flowItems[i].actionType = 'Status';
              break;

            case NotificationType.ContributionReminder:
              flowItems[i].actionType = 'Status';
              flowItems[i].additionalMessage = 'View all outstanding charges in Personal Account page';
              break;

          }
        }
      }
      this.flowItems = flowItems;
    });
  }

  evaluateLoan(flowItemIndex, evaluation) {
    this.ledgerService.getTransactionById(this.flowItems[flowItemIndex].transactionId)
      .subscribe(loan => {
        let toastMsg = 'Loan application denied';
        let toastType = 'info';
        loan.evaluatedBy = this.authService.currentUser.UserId;
        if (evaluation === 'approved') {
          loan.approved = true;
          toastMsg = 'Loan application approved';
          toastType = 'Success';
        }
        this.ledgerService.evaluateLoan(loan)
        .subscribe(evaluatedLoan => {
          this.addToast(toastType, toastMsg);
          console.log(evaluatedLoan);
        },
        err => {
          this.addToast('error', err);
        });
      });
  }

  viewContributions() {
    this.router.navigate(['/personal'], {
      queryParams: { goto: 'contributions' }
    });
  }

  confirm(flowItem) {
    switch (flowItem.notificationType) {
      case NotificationType.PersonalDepositAsAdmin:
        this.ledgerService.confirmPersonalDeposit(flowItem.transactionId)
          .subscribe(res => {
            this.addToast('info', 'Confirmed');
          },
          err => {
            this.addToast('error', err);
          });
        break;

      case NotificationType.PersonalWithdrawalAsWithdrawer:
        this.ledgerService.confirmPersonalWithdrawal(flowItem.transactionId)
          .subscribe(res => {
            this.addToast('info', 'Confirmed');
          },
          err => {
            this.addToast('error', err);
          });
        break;

      case NotificationType.DepositToChamaAsAdmin:
        this.ledgerService.confirmChamaDeposit(flowItem.transactionId)
          .subscribe(res => {
            this.addToast('info', 'Confirmed');
          },
          err => {
            this.addToast('error', err);
          });
        break;

      case NotificationType.WithdrawFromChamaAsAdmin:
        this.ledgerService.confirmChamaWithdrawal(flowItem.transactionId)
          .subscribe(res => {
            this.addToast('info', 'Confirmed');
          },
          err => {
            this.addToast('error', err);
          });
        break;
    }

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

  public updateOptions() {
    // this.salesChart.data.datasets[0].data = this.data;
    // this.salesChart.update();
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
