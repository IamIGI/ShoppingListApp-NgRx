import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { catchError, BehaviorSubject, tap } from 'rxjs';
import { errorMessageHandler } from './auth-errorMessages.services';
import { User } from './user.model';
import { Router } from '@angular/router';
import localStorageDictionaries from '../data/localStorage.dictionaries';

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
  private tokeExpirationTimeout: any;

  constructor(private http: HttpClient, private router: Router) {}

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      const expirationDuration = this.calculateTimeForTokenToExpire(
        userData._tokenExpirationDate
      );
      this.autoLogout(expirationDuration);

      this.user.next(loadedUser);
    }
  }

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
    this.saveUserDataToLocalStorage(user);
    this.autoLogout(Number(expiresIn) * 1000);
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    this.removeUserDataFromLocalStorage();

    if (this.tokeExpirationTimeout) {
      clearTimeout(this.tokeExpirationTimeout);
    }
  }

  /**
   * Automatically logout user after time expired
   *
   * @param expirationDuration pass value in milliseconds
   */
  autoLogout(expirationDuration: number) {
    this.tokeExpirationTimeout = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  saveUserDataToLocalStorage(user: User) {
    localStorage.setItem(
      localStorageDictionaries.userData,
      JSON.stringify(user)
    );
  }

  removeUserDataFromLocalStorage() {
    localStorage.removeItem(localStorageDictionaries.userData);
  }
  /** return time in milliseconds */
  calculateTimeForTokenToExpire(expirationDate: string) {
    return new Date(expirationDate).getTime() - new Date().getTime();
  }
}
