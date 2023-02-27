import { Component } from '@angular/core';
import { pageLegend } from './data/pageLegend';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  pageLegend = pageLegend;
  pageSelector;

  currentPage(pageName: string) {
    this.pageSelector = pageName;
  }
}
