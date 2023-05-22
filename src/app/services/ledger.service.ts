import { Injectable } from "@angular/core";
import { JwtHelper, tokenNotExpired } from "angular2-jwt";
import { Http, RequestOptions, URLSearchParams } from "@angular/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";
import { NotificationType } from "../shared/flow-type.enum";

@Injectable()
export class LedgerService {
  private _url = "https://wekezapp-mock-api-production.up.railway.app/ledger/";
  private options: RequestOptions = new RequestOptions();

  constructor(
    private http: Http,
    private authService: AuthService,
    private userService: UserService
  ) {}

  requestPersonalDeposit(transac) {
    console.log(transac);
    return this.http.post(this._url + "requestPersonalDeposit", transac);
  }

  confirmPersonalDeposit(transactionId) {
    const confirmerId = this.authService.currentUser.UserId;
    return this.http
      .post(
        this._url +
          "confirmPersonalDeposit/" +
          transactionId +
          "/" +
          confirmerId,
        true
      )
      .pipe(map((response) => response.text()));
  }

  requestPersonalWithdrawal(transac) {
    console.log(transac);
    return this.http.post(this._url + "requestPersonalWithdrawal", transac);
  }

  confirmPersonalWithdrawal(transactionId) {
    const confirmerId = this.authService.currentUser.UserId;
    return this.http
      .post(
        this._url +
          "confirmPersonalWithdrawal/" +
          transactionId +
          "/" +
          confirmerId,
        true
      )
      .pipe(map((response) => response.text()));
  }

  requestChamaDeposit(transac) {
    transac.DepositorId = this.authService.currentUser.UserId;
    console.log(transac);
    return new Observable((subscriber) => {
      subscriber.next([]);
      subscriber.complete();
    });
    return this.http.post(this._url + "requestChamaDeposit", transac);
  }

  confirmChamaDeposit(transactionId) {
    const confirmerId = this.authService.currentUser.UserId;
    return this.http
      .post(
        this._url + "confirmChamaDeposit/" + transactionId + "/" + confirmerId,
        true
      )
      .pipe(map((response) => response.text()));
  }

  requestChamaWithdrawal(transac) {
    transac.WithdrawerId = this.authService.currentUser.UserId;
    console.log(transac);
    return new Observable((subscriber) => {
      subscriber.next([]);
      subscriber.complete();
    });
    return this.http.post(this._url + "requestChamaWithdrawal", transac);
  }

  confirmChamaWithdrawal(transactionId) {
    const confirmerId = this.authService.currentUser.UserId;
    return this.http
      .post(
        this._url +
          "confirmChamaWithdrawal/" +
          transactionId +
          "/" +
          confirmerId,
        true
      )
      .pipe(map((response) => response.text()));
  }

  requestLoan(amount) {
    const receiverId = this.authService.currentUser.UserId;

    console.log({ receiverId, amount, dateRequested: new Date() });
    return this.http
      .post(this._url + "requestLoan", {
        receiverId,
        amount,
        dateRequested: new Date(),
      })
      .pipe(map((response) => response.json()));
  }

  addExistingLoan(loan) {
    return this.http
      .post(this._url + "requestLoan", loan)
      .pipe(map((response) => response.json()));
  }

  evaluateLoan(loanDto) {
    return this.http
      .post(this._url + "evaluateLoan", loanDto)
      .pipe(map((response) => response.json()));
  }

  repayLoan(loanId, amount) {
    return this.http
      .post(this._url + "payLoan/" + loanId + "/" + amount, true)
      .pipe(map((response) => response.json()));
  }

  getAllLoans() {
    return this.http
      .get(this._url + "getAllLoans")
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
      .get(this._url + "getLoansForUser/" + this.authService.currentUser.UserId)
      .pipe(map((response) => response.json()));
  }

  getTransactionById(id) {
    return this.http
      .get(this._url + "getTransactionById/" + id)
      .pipe(map((response) => response.json()));
  }

  createMgr() {
    return this.http.get(this._url).pipe(map((response) => response.json()));
  }

  disburseMgr(transactionId) {
    this.options.params = new URLSearchParams("transactionId=" + transactionId);

    console.log(transactionId);
    return new Observable((subscriber) => {
      subscriber.next([]);
      subscriber.complete();
    });
    return this.http
      .post(this._url + "disburseMgr/" + transactionId, true)
      .pipe(map((response) => response.json()));
  }

  createContributions() {
    return new Observable((subscriber) => {
      subscriber.next([]);
      subscriber.complete();
    });
    return this.http.get(this._url + "createContributions");
  }

  contributeToChama(amountToContribute, startWithOld) {
    console.log(amountToContribute, startWithOld);
    this.options.params = new URLSearchParams(
      "userId=" +
        this.authService.currentUser.UserId +
        "&amount=" +
        amountToContribute +
        "&startWithOld=" +
        startWithOld
    );
    return this.http
      .get(this._url + "payContribution", this.options)
      .pipe(map((response) => response.json()));
  }

  payout(userId, amount) {
    console.log(userId + "," + amount);
    return new Observable((subscriber) => {
      subscriber.next({});
      subscriber.complete();
    });
    return this.http
      .post(
        this._url +
          "payout/" +
          userId +
          "/" +
          amount +
          "/" +
          this.authService.currentUser.UserId,
        true
      )
      .pipe(map((response) => response.json()));
  }
}
