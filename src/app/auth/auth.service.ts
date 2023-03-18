import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { catchError, throwError } from 'rxjs';

interface AuthResponseData {
  localId: string;
  email: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.webApiKey}`;

  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.SIGNUP_URL, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((errorRes) => {
          let errorMessage = new Error('An unknown error occurred!');
          if (!errorRes || !errorRes.error.error) {
            return throwError(() => errorMessage);
          }

          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = new Error(
                'The email address is already in use by another account.'
              );
            case 'OPERATION_NOT_ALLOWED':
              errorMessage = new Error(
                'Password sign-in is disabled for this project.'
              );
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
              errorMessage = new Error(
                ' We have blocked all requests from this device due to unusual activity. Try again later.'
              );
          }
          return throwError(() => errorMessage);
        })
      );
  }
}
