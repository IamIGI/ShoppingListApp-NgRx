import { Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as AuthActions from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { createEffect } from '@ngrx/effects';
import { Router } from '@angular/router';

export interface AuthResponseData {
  localId: string;
  email: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.webApiKey}`;

  authLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(this.LOGIN_URL, {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          })
          .pipe(
            map((resData) => {
              const expirationDate = new Date(
                new Date().getTime() + +resData.expiresIn * 1000
              );
              return new AuthActions.Login({
                email: resData.email,
                userId: resData.localId,
                token: resData.idToken,
                expirationDate: expirationDate,
              });
            }),
            catchError((errorRes) => {
              let errorMessage = 'An unknown error occurred';
              if (!errorRes.error || !errorRes.error.error) {
                return of(new AuthActions.LoginFail(errorMessage));
              }
              switch (errorRes.error.error.message) {
                case 'EMAIL_EXISTS':
                  errorMessage =
                    'The email address is already in use by another account.';
                  break;
                case 'OPERATION_NOT_ALLOWED':
                  errorMessage =
                    'Password sign-in is disabled for this project.';
                  break;
                case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                  errorMessage =
                    'We have blocked all requests from this device due to unusual activity. Try again later.';
                  break;
                case 'EMAIL_NOT_FOUND':
                  errorMessage =
                    'There is no user record corresponding to this identifier. The user may have been deleted.';
                  break;
                case 'INVALID_PASSWORD':
                  errorMessage =
                    'The password is invalid or the user does not have a password.';
                  break;
                case 'USER_DISABLED':
                  errorMessage =
                    'The user account has been disabled by an administrator.';
                  break;
                default:
                  break;
              }
              return of(new AuthActions.LoginFail(errorMessage));
            })
          );
      })
    )
  );

  //this effect do not dispatch any action at the end
  authSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  //$ - it's saying that it is action observable
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
