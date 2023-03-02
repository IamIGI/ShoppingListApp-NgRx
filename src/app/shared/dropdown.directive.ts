import {
  Directive,
  HostBinding,
  ElementRef,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  //HostBinding allows us to bind to the properties o element that directive is place on
  // class is array of all the classes
  @HostBinding('class.open') isOpen: boolean = false; // attach class to element when true, 'open' is bootstrap class

  //create custom class
  // - close / open method
  //   @HostListener('click') toggleOpen() {
  //     this.isOpen = !this.isOpen;
  //   }

  // - open / close by clicking anywhere method
  @HostListener('document:click', ['$event']) toggleAnywhere(event: Event) {
    const isElementOfDocumentClicked = this.elRef.nativeElement.contains(
      event.target
    );
    this.isOpen = isElementOfDocumentClicked ? !this.isOpen : false;
  }

  constructor(private elRef: ElementRef) {}
}
