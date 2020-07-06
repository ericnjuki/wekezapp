import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from '../../variables/charts';
import { UserService } from 'src/app/services/user.service';
import { NotificationType } from 'src/app/shared/flow-type.enum';
import { LedgerService } from 'src/app/services/ledger.service';
import { AuthService } from 'src/app/services/auth.service';
// import { stat } from 'fs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked = true;
  public clicked1 = false;

  private flowItems;

  constructor(private userService: UserService, private ledgerService: LedgerService, private authService: AuthService) { }

  ngOnInit() {
    this.processFlow();
    // this.flowItems = this.userService.getFlow();

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];

    const chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());

    const ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });

    const chartSales = document.getElementById('chart-sales');

    this.salesChart = new Chart(chartSales, {
      type: 'line',
      options: chartExample1.options,
      data: chartExample1.data
    });
  }

  processFlow() {
    this.userService.getFlow()
    .subscribe(res => {
      console.log(res);
      let flowItems = [];
      flowItems = res;
      flowItems.reverse();

      for (let i = 0; i < flowItems.length; i++) {
        const dateCreated = new Date(flowItems[i].dateCreated);
        flowItems[i].newDateCreated = dateCreated.toDateString();

        if (flowItems[i].isConfirmable) {
          switch (flowItems[i].notificationType) {
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
          }
        }
      }
      this.flowItems = flowItems;
    });
  }

  evaluateLoan(flowItemIndex, evaluation) {
    this.ledgerService.getTransactionById(this.flowItems[flowItemIndex].transactionId)
      .subscribe(loan => {
        loan.evaluatedBy = this.authService.currentUser.UserId;
        if (evaluation === 'approved') {
          loan.approved = true;
        }
        this.ledgerService.evaluateLoan(loan)
        .subscribe(evaluatedLoan => {
          console.log(evaluatedLoan);
        });
      });
  }

  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

}
