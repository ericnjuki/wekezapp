import { Injectable } from '@angular/core';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { Chama } from '../shared/chama.model';
import { User } from '../shared/user.model';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {
  private _url = 'https://localhost:44380/api/users/';

  constructor(private http: Http) { }

  getAllUsers() {
    return new Observable(subscriber => {
      subscriber.next(
        [
          {
            userId: '1',
            firstName: 'Fred Makoha',
            secondName: '',
            email: 'a@b.c',
            role: 'Chairperson',
            token: 'token',
            balance: '1500',
            nextMGR: new Date()
          },
          {
            userId: '2',
            firstName: 'Francine Makoha',
            secondName: '',
            email: 'francine@b.c',
            role: 'Member',
            token: 'token',
            balance: '1000',
            nextMGR: new Date()
          },
          {
            userId: '3',
            firstName: 'Beatrice Nyaga',
            secondName: '',
            email: 'beatrice@b.c',
            role: 'Member',
            token: 'token',
            balance: '750',
            nextMGR: new Date()
          }
        ]
      );
      subscriber.complete();
    });
  }

  findByUsername(username) {
    console.log('fetching user...');
    return new Observable(subscriber => {
      subscriber.next({
        userId: '1',
        firstName: 'Fred Makoha',
        secondName: '',
        email: 'a@b.c',
        role: 'Chairperson',
        token: 'token',
        balance: '0'
      });
      subscriber.complete();
    });
    return this.http
      .get(this._url + 'u/' + username)
        .pipe(map(response => response.json()));
  }

  addUsers(users: User[]) {
    console.log('users being posted: ');
    console.log(users);

    // return new Observable(subscriber => {
    //   subscriber.next(true);
    //   subscriber.complete();
    // });
    return this.http
      .post(this._url + 'addBulk', users);
  }
}
