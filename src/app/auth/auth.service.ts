import { Injectable } from '@angular/core';
//Reducer imports
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokeExpirationTimeout: any;

  constructor(private store: Store<fromApp.AppState>) {}

  /**
   * Automatically logout user after time expired
   *
   * @param expirationDuration pass value in milliseconds
   */
  setLogoutTimer(expirationDuration: number) {
    this.tokeExpirationTimeout = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokeExpirationTimeout) {
      clearTimeout(this.tokeExpirationTimeout);
      this.tokeExpirationTimeout = null;
    }
  }
}
