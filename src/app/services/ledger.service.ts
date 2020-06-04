import { Injectable } from '@angular/core';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class LedgerService {
  private _url = 'https://localhost:44380/api/ledger/';

  constructor(private http: Http) { }

  requestPersonalDeposit(transac) {
    console.log(transac);
    return this.http
    .post(this._url + 'requestPersonalDeposit', transac);
  }
}
