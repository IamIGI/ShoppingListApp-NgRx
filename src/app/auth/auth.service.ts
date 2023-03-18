import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { catchError, Subject, BehaviorSubject, tap } from 'rxjs';
import { errorMessageHandler } from './auth-errorMessages.services';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  localId: string;
  email: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.webApiKey}`;
  LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.webApiKey}`;

  //   user = new Subject<User>();
  user = new BehaviorSubject<User>(null); //BehaviorSubject allows to see the history of emitted data.

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.SIGNUP_URL, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((errorRes) => errorMessageHandler('register', errorRes)),
        tap((resData) =>
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            resData.expiresIn
          )
        )
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.LOGIN_URL, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((errorRes) => errorMessageHandler('login', errorRes)),
        tap((resData) =>
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            resData.expiresIn
          )
        )
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: string
  ) {
    const expirationDate = new Date(
      new Date().getTime() + Number(expiresIn) * 1000
    ); //convert it into normal date new Date()
    const user = new User(email, userId, token, expirationDate);

    this.user.next(user); // emit this as current user
  }
}
