import { Component } from '@angular/core';

//Website with pure css spinners:
//https://loading.io/css/
@Component({
  selector: 'app-loading-spinner',
  template:
    '<div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>',
  styleUrls: ['./loading-spinner.component.css'],
})
export class LoadingSpinnerComponent {}
