import { Injectable } from '@angular/core';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { NotificationType } from '../shared/flow-type.enum';

@Injectable()
export class LedgerService {
  private _url = 'https://localhost:44380/api/ledger/';
  private options: RequestOptions = new RequestOptions();

  constructor(private http: Http, private authService: AuthService, private userService: UserService) { }

  requestPersonalDeposit(transac) {
    console.log(transac);
    return this.http
    .post(this._url + 'requestPersonalDeposit', transac);
  }

  requestLoan(amount) {
    const receiverId = this.authService.currentUser.UserId;

    console.log({receiverId, amount, dateRequested: new Date()});
    return this.http
    .post(this._url + 'requestLoan', {receiverId, amount, dateRequested: new Date()})
    .pipe(map((response) => response.json()));
  }

  evaluateLoan(loanDto) {
    return this.http
    .post(this._url + 'evaluateLoan', loanDto)
    .pipe(map((response) => response.json()));
  }

  repayLoan(loanId, amount) {
    return this.http
    .post(this._url + 'repayLoan', {loanId, amount})
    .pipe(map((response) => response.json()));
  }

  getAllLoans() {
    return this.http
    .get(this._url + 'getAllLoans')
    .pipe(map((response) => response.json()));
    // returns
    // [{
    // amount: 1000
    // amountPaidSoFar: 0
    // amountPayable: 0
    // approved: false
    // dateClosed: "0001-01-01T00:00:00"
    // dateDue: "0001-01-01T00:00:00"
    // dateIssued: "0001-01-01T00:00:00"
    // dateRequested: "2020-06-24T10:57:32.912"
    // evaluatedBy: 0
    // interestRate: 0
    // isClosed: false
    // isDefaulted: false
    // latePaymentFine: 0
    // receiverId: 21
    // transactionId: 5
    // }]
  }

  getMyLoans() {
    return this.http
    .get(this._url + 'getLoansForUser/' + this.authService.currentUser.UserId)
    .pipe(map((response) => response.json()));
  }

  getTransactionById(id) {
    return this.http
    .get(this._url + 'getTransactionById/' + id)
    .pipe(map((response) => response.json()));
  }

  createMgr() {
    return this.http
    .get(this._url + 'createMgr')
    .pipe(map((response) => response.json()));
  }

  disburseMgr(transactionId) {
    this.options.params = new URLSearchParams(
      'transactionId=' + transactionId
    );

    console.log(transactionId);
    return this.http
    .post(this._url + 'disburseMgr/' + transactionId, true)
    .pipe(map((response) => response.json()));
  }
}
