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

@Component({
  selector: 'app-personal-account',
  templateUrl: 'personal-account.component.html',
  styleUrls: ['./personal-account.component.css']
})
export class PersonalAccountComponent implements OnInit {
  depositAmt = 1050;

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked = true;
  public clicked1 = false;

  constructor(private ledgerService: LedgerService, private authService: AuthService) { }

  ngOnInit() {

    this.datasets = [
      [0, 20, 10, 30, 80, 40, 20, 60, 60],
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

  requestPersonalDeposit() {
    this.ledgerService.requestPersonalDeposit({
      DepositorId: this.authService.currentUser.UserId,
      Amount: this.depositAmt
    }).subscribe(res => {
      console.log(res);
    }, err => {
      console.log(err);
    });
  }

  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }
}
