import { Injectable } from "@angular/core";
import { JwtHelper, tokenNotExpired } from "angular2-jwt";
import { Http } from "@angular/http";
import { map } from "rxjs/operators";
import { Chama } from "../shared/chama.model";
import { Observable } from "rxjs";
import { LedgerService } from "./ledger.service";

@Injectable()
export class ChamaService {
  // private _url = 'https://localhost:44380/api/chama/';
  private _url = "https://wekezapp-mock-api-production.up.railway.app/chama/";

  constructor(private http: Http, private ledgerService: LedgerService) {}

  getChama() {
    return this.http.get(this._url).pipe(
      map((response) => {
        return response.json()[0];
      })
    );
  }

  createChama(chamaDto: Chama) {
    console.log("adding chama..");
    // return new Observable(subscriber => {
    //   subscriber.next({
    //     chamaId: 1
    //   });
    //   subscriber.complete();
    // });
    return this.getChama();
    return this.http.post(this._url, chamaDto);
    // .pipe(map(response => {
    //   if (response.ok) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }))
  }

  updateChama(chamaDto: Chama) {
    console.log("updating chama: ");
    console.log(chamaDto);
    // return new Observable(subscriber => {
    //   subscriber.next(true);
    //   subscriber.complete();
    // });
    chamaDto = this.toCamel(chamaDto);
    return this.http.put(this._url + chamaDto.chamaId, chamaDto);
  }

  doTheRegularChecks() {
    // TODO: have contributions been stopped? (add it to status)
    // each interested component will check the relevant part of status

    const statusReport = [];
    // contributions
    this.http
      .get(this._url + "isContributionsDay")
      .subscribe((isContributionDay) => {
        console.log("isContributionDay Response: ");
        console.log(isContributionDay);
        if (isContributionDay) {
          this.ledgerService.createContributions();
          statusReport.push({ contributions: "created" });
        } else {
          statusReport.push({ contributions: "not today" });
        }
      });

    return statusReport;
  }

  toCamel(o) {
    var newO, origKey, newKey, value;
    if (o instanceof Array) {
      return o.map(function (value) {
        if (typeof value === "object") {
          value = this.toCamel(value);
        }
        return value;
      });
    } else {
      newO = {};
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          newKey = (
            origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey
          ).toString();
          value = o[origKey];
          if (
            value instanceof Array ||
            (value !== null && value.constructor === Object)
          ) {
            value = this.toCamel(value);
          }
          newO[newKey] = value;
        }
      }
    }
    return newO;
  }
}
