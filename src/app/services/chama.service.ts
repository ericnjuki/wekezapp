import { Injectable } from '@angular/core';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { Chama } from '../shared/chama.model';
import { Observable } from 'rxjs';
import { LedgerService } from './ledger.service';

@Injectable()
export class ChamaService {
  private _url = 'https://localhost:44380/api/chama/';

  constructor(private http: Http, private ledgerService: LedgerService) { }

  getChama() {
    return this.http.get(this._url)
    .pipe(map(response => response.json()));
  }

  createChama(chamaDto) {
    console.log('adding chama..');
    // return new Observable(subscriber => {
    //   subscriber.next({
    //     chamaId: 1
    //   });
    //   subscriber.complete();
    // });
    return this.http
      .post(this._url + 'add', chamaDto)
      // .pipe(map(response => {
      //   if (response.ok) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // }))
      ;
  }

  updateChama(chamaDto) {
    console.log('updating chama: ');
    console.log(chamaDto);
    // return new Observable(subscriber => {
    //   subscriber.next(true);
    //   subscriber.complete();
    // });
    return this.http
      .put(this._url + 'update', chamaDto);
  }

  doTheRegularChecks() {
    // TODO: have contributions been stopped? (add it to status)
    // each interested component will check the relevant part of status

    const statusReport = [];
    // contributions
    this.http.get(this._url + 'isContributionsDay')
    .subscribe(isContributionDay => {
      console.log('isContributionDay Response: ');
      console.log(isContributionDay);
      if (isContributionDay) {
        this.ledgerService.createContributions();
        statusReport.push({'contributions': 'created'});
      } else {
        statusReport.push({'contributions': 'not today'});
      }
    });

    return statusReport;
  }
}
