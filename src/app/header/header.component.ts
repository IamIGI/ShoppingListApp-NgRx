import { Component, Output, EventEmitter } from '@angular/core';
import { pageLegend } from '../data/pageLegend';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  pageLegend = pageLegend;
  @Output() currentPage = new EventEmitter<string>();

  ngOnInit() {
    this.currentPage.emit(pageLegend.recipes);
  }

  changePage(pageName: string) {
    this.currentPage.emit(pageName);
  }
}
