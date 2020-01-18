import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-page-nav',
  templateUrl: './page-nav.component.html',
  styleUrls: ['./page-nav.component.scss']
})
export class PageNavComponent {

  @Input() page: number;
  @Input() totalPages: number;

  @Output() changePage: EventEmitter<number> = new EventEmitter<number>();

  previousPage(): void {
    this.page = this.page - 1;
    this.changePage.emit(this.page);
  }

  nextPage(): void {
    this.page = this.page + 1;
    this.changePage.emit(this.page);
  }

  checkPreviousPage(): boolean {
    return !(this.page > 0);
  }

  checkNextPage(): boolean {
    console.log(this.totalPages + this.page)
    return !(this.page < this.totalPages - 1);
  }
}
