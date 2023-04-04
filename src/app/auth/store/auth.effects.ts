import { Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as AuthActions from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { createEffect } from '@ngrx/effects';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  localId: string;
  email: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  registered?: boolean;
}

/** return time in milliseconds */
const calculateTimeForTokenToExpire = (expirationDate: string) => {
  return new Date(expirationDate).getTime() - new Date().getTime();
};

/**
 * Automatically logout user after time expired
 *
 * @param expirationDuration pass value in milliseconds
 */
// const  autoLogout = (expirationDuration: number) =>  {
//     this.tokeExpirationTimeout = setTimeout(() => {
//       this.logout();
//     }, expirationDuration);
//   }

const saveUserDataToLocalStorage = (user: User) => {
  localStorage.setItem('userData', JSON.stringify(user));
};

const removeUserDataFromLocalStorage = () => {
  localStorage.removeItem('userData');
};

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(
    new Date().getTime() + Number(expiresIn) * 1000
  );
  const user = new User(email, userId, token, expirationDate);
  saveUserDataToLocalStorage(user);

  return new AuthActions.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate: expirationDate,
  });
};

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'The email address is already in use by another account.';
      break;
    case 'OPERATION_NOT_ALLOWED':
      errorMessage = 'Password sign-in is disabled for this project.';
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
      errorMessage = 'The user account has been disabled by an administrator.';
      break;
    default:
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.webApiKey}`;
  LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.webApiKey}`;

  authSignup = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
          return this.http
            .post<AuthResponseData>(this.SIGNUP_URL, {
              email: signupAction.payload.email,
              password: signupAction.payload.password,
              returnSecureToken: true,
            })
            .pipe(
              tap((resData) => {
                this.authService.setLogoutTimer(
                  Number(resData.expiresIn) * 1000
                );
              }),
              map((resData) => {
                return handleAuthentication(
                  Number(resData.expiresIn),
                  resData.email,
                  resData.localId,
                  resData.idToken
                );
              }),
              catchError((errorRes) => {
                return handleError(errorRes);
              })
            );
        })
      ),
    { dispatch: false }
  );

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
            tap((resData) => {
              this.authService.setLogoutTimer(Number(resData.expiresIn) * 1000);
            }),
            map((resData) => {
              return handleAuthentication(
                Number(resData.expiresIn),
                resData.email,
                resData.localId,
                resData.idToken
              );
            }),
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      })
    )
  );

  //this effect do not dispatch any action at the end
  authRedirect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
          return { type: 'DUMMY IDENTY' };
        }

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          const expirationDuration = calculateTimeForTokenToExpire(
            userData._tokenExpirationDate
          );
          this.authService.setLogoutTimer(expirationDuration);
          return new AuthActions.AuthenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
          });
          // const expirationDuration = calculateTimeForTokenToExpire(
          //   userData._tokenExpirationDate
          // );
          // this.autoLogout(expirationDuration);
        }
        return { type: 'DUMMY IDENTY' };
      })
    )
  );

  authLogout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          removeUserDataFromLocalStorage();
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );

  //$ - it's saying that it is action observable
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
