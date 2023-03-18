import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthResponseData } from './auth.service';

export function errorMessageHandler(
  errorOrigin: 'login' | 'register',
  error: HttpErrorResponse
): Observable<AuthResponseData> {
  let errorMessage = new Error('An unknown error occurred!');
  if (!error || !error.error.error) {
    return throwError(() => errorMessage);
  }
  const errorCode = error.error.error.message;
  switch (errorOrigin) {
    case 'register': {
      switch (errorCode) {
        case 'EMAIL_EXISTS':
          errorMessage = new Error(
            'The email address is already in use by another account.'
          );
          break;
        case 'OPERATION_NOT_ALLOWED':
          errorMessage = new Error(
            'Password sign-in is disabled for this project.'
          );
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          errorMessage = new Error(
            ' We have blocked all requests from this device due to unusual activity. Try again later.'
          );
          break;
      }
      break;
    }
    case 'login': {
      switch (errorCode) {
        case 'EMAIL_EXISTS':
          errorMessage = new Error(
            'There is no user record corresponding to this email. The user may have been deleted.'
          );
          break;
        case 'INVALID_PASSWORD':
          errorMessage = new Error(
            'The password is invalid or the user does not have a password.'
          );
          break;
        case 'USER_DISABLED':
          errorMessage = new Error(
            'The user account has been disabled by an administrator.'
          );
          break;
      }
      break;
    }
  }

  return throwError(() => errorMessage);
}
