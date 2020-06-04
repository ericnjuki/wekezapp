import { Injectable } from '@angular/core';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  private _url = 'https://localhost:44380/api/users/';

  constructor(private http: Http, private router: Router) { }
  register(credentials: {}) {
    console.log('registering user..');
    // return new Observable(subscriber => {
    //   subscriber.next({
    //     userId: '1',
    //     firstName: 'Fred Makoha',
    //     secondName: '',
    //     email: 'a@b.c',
    //     role: 'Chairperson',
    //     token: 'token',
    //     balance: '0'
    //   });
    //   subscriber.complete();
    // });
    return this.http
      .post(this._url + 'register', credentials)
      .pipe(map(response => {
        if (response.ok) {
          return true;
        } else {
          return false;
        }
      }));
  }

  login(credentials: {}) {
    console.log('logging in user...');
    return this.http
      .post(this._url + 'login', credentials)
      .pipe(map(response => {
        const result = response.json();
        // console.log(result);

        if (result && result.token) {
          localStorage.setItem('token', result.token);
          return true;
        } else if (result && result.Token) {
          localStorage.setItem('token', result.Token);
          return true;
        }
        return false;
      }));
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    // const jwtHelper = new JwtHelper();
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    }
    return false;
  }

  get currentUser() {
    const jwtHelper = new JwtHelper();
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    return jwtHelper.decodeToken(token);
      // returns:
      // Email: "a@b.c"
      // Role: "Admin"
      // UserId: "3018"
      // exp: 1585736165
      // iat: 1585732565
      // nbf: 1585732565
  }
}
