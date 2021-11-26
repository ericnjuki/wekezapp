import { Injectable } from '@angular/core';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';




@Injectable()
export class AuthService {
  // private _url = 'https://localhost:44380/api/users/';
  private _url = 'http://localhost:3000/users/';
  private handleError(error: HttpErrorResponse) {
     if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        // alert('ErrorEvent ' + error.error.message);
         console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong
        console.log(error.status + ':::' + error.error.message);
        switch (error.status) {
          case 400:
            return throwError(400);
        }
        // console.error( Backend returned code ${error.status},  + body was: ${error.error}); }
        //  console.error('error');
      }
          // return an observable with a user-facing error message
           return throwError('Something bad happened; please try again later.');
    }

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
      .get(this._url + 'register', credentials)
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
      .get(this._url + 'login', credentials)
      .pipe(map(response => {
        const result = response.json();
        console.log("les resultat: ");
        console.log(result);

        if (result && result.token) {
          localStorage.setItem('token', result.token);
          return true;
        } else if (result[0] && result[0].Token) {
          localStorage.setItem('token', result[0].Token);
          return true;
        }
        return false;
      }), catchError(this.handleError));
  }

  logout(returnUrl?: string) {
    localStorage.removeItem('token');
    this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl}});
  }

  sendRecoveryCode(email) {
    return this.http.get(this._url + 'sendRecoveryCode/' + email)
    .pipe(map(response => response.text()));
  }

  recoverPassword(email, code) {
    return this.http.get(this._url + 'recover/' + email + '/' + code)
    .pipe(map(response => response.text()));
  }

  isLoggedIn() {
    // const jwtHelper = new JwtHelper();
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    }
    return false;
  }

  get currentUserIsAdmin() {
    if (this.currentUser.Role === 'Admin' || this.currentUser.Role === 'Treasurer') {
      return true;
    }
    return false;
  }

  get currentUser() {
    const jwtHelper = new JwtHelper();
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
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
