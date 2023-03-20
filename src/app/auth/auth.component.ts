import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;
  alertSub = new Subscription();

  @ViewChild('alertBox', { read: ViewContainerRef })
  alertBox: ViewContainerRef;

  constructor(private authService: AuthService, private router: Router) {}

  authObs: Observable<AuthResponseData>;

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    if (this.isLoginMode) {
      this.authObs = this.authService.login(email, password);
    } else {
      this.authObs = this.authService.signUp(email, password);
    }

    this.authObs.subscribe({
      next: (response) => {
        console.log(response);
        this.navigateOnSuccess();
        this.error = null;
        this.isLoading = false;
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this.showAlertBox(errorMessage);
        this.isLoading = false;
      },
    });

    form.reset();
  }

  showAlertBox(errorMessage: any) {
    this.alertBox.clear();
    const alert = this.alertBox.createComponent(AlertComponent);
    alert.instance.message = errorMessage;
    this.alertSub = alert.instance.close.subscribe(() => {
      this.closeErrorBox();
    });
    this.error = errorMessage;
  }

  closeErrorBox() {
    this.alertBox.clear();
    this.error = null;
  }

  navigateOnSuccess() {
    this.router.navigate(['./recipes']);
  }

  ngOnDestroy() {
    this.alertSub.unsubscribe();
  }
}
