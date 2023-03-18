import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { catchError, throwError } from 'rxjs';
import { errorMessageHandler } from './auth-errorMessages.services';

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

  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.SIGNUP_URL, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((errorRes) => errorMessageHandler('register', errorRes))
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.LOGIN_URL, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(catchError((errorRes) => errorMessageHandler('login', errorRes)));
  }
}
