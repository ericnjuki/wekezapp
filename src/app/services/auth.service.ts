import { Injectable } from '@angular/core';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private _url = 'https://localhost:44380/api/users/';

  constructor(private http: Http) { }
  register(credentials: {}) {
    return this.http
      .post(this._url + 'register', credentials);
  }

  login(credentials: {}) {
    return this.http
      .post(this._url + 'login', credentials)
      .pipe(map(response => {
        const result = response.json();
        console.log(result);

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
  }
}
