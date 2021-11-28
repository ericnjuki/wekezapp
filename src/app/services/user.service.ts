import { Injectable } from '@angular/core';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { map } from 'rxjs/operators';
import { Chama } from '../shared/chama.model';
import { User } from '../shared/user.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { NotificationType } from '../shared/flow-type.enum';

@Injectable()
export class UserService {
  // private _url = 'https://localhost:44380/api/users/';
  private _url = 'https://wekezapp-mock.herokuapp.com/users/';

  private options: RequestOptions = new RequestOptions();

  constructor(private http: Http, private authService: AuthService) {}

  getAllUsers() {
    return this.http.get(this._url).pipe(map((response) => response.json()));
    return new Observable((subscriber) => {
      subscriber.next([
        {
          userId: '1',
          firstName: 'Fred Makoha',
          secondName: '',
          email: 'a@b.c',
          role: 'Chairperson',
          token: 'token',
          balance: '1500',
          nextMGR: new Date(),
        },
        {
          userId: '2',
          firstName: 'Francine Makoha',
          secondName: '',
          email: 'francine@b.c',
          role: 'Member',
          token: 'token',
          balance: '1000',
          nextMGR: new Date(),
        },
        {
          userId: '3',
          firstName: 'Beatrice Nyaga',
          secondName: '',
          email: 'beatrice@b.c',
          role: 'Member',
          token: 'token',
          balance: '750',
          nextMGR: new Date(),
        },
      ]);
      subscriber.complete();
    });
  }

  findById(userId) {
    console.log('fetching user...');
    return this.http
      .get(this._url + userId)
      .pipe(map((response) => response.json()[0]));
  }

  addUsers(users: User[]) {
    console.log('users being posted: ');
    console.log(users);

    // return new Observable(subscriber => {
    //   subscriber.next(true);
    //   subscriber.complete();
    // });
    this.options.params = new URLSearchParams(
      'addedBy=' + this.authService.currentUser.UserId
    );
    // console.log('addedBy: ' + this.authService.currentUser.UserId);
    // return this.http.post(this._url, users, this.options);
    return new Observable((subscriber) => {
      subscriber.next([]);
      subscriber.complete();
    });
  }

  updateUser(user: User) {
    user.updatedBy = this.authService.currentUser.UserId;
    console.log('updating user...');
    console.log(user);
    return this.findById(user.userId);
    return this.http.put(this._url, user);
  }

  getFlow() {
    // this.options.params = new URLSearchParams(
    //   'userId=' + this.authService.currentUser.UserId
    // );
    return this.http
      .get(this._url + 'getFlow')
      .pipe(map((response) => response.json()));

    // returns:
    // body: "Fred Makoha added 1 new members to the chama"
    // dateCreated: "2020-06-16T12:03:50.7985722"
    // dateModified: "0001-01-01T00:00:00"
    // flowItemId: 7
    // hasBeenSeenBy: null
    // isConfirmable: false
    // isConfirmed: false
  }

  getFlowOfType(notificationType: NotificationType) {
    this.options.params = new URLSearchParams(
      'userId=' + this.authService.currentUser.UserId +
      '&notificationType=' + notificationType
    );
    return this.http
      .get(this._url + 'getFlowOfType', this.options)
      .pipe(map((response) => response.json()));
  }
}
