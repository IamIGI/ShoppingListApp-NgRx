import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
  WEB_API_KEY = 'AIzaSyBAMQCTEiY9aZNV7Aflf7IBAV5UMISGqY0';
  SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.WEB_API_KEY}`;

  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(this.SIGNUP_URL, {
      email,
      password,
      returnSecureToken: true,
    });
  }
}
