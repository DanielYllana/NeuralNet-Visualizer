/*import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    console.log('Open dropdown');
    this.isOpen = this.elRef.nativeElement.contains(event.target)
      ? !this.isOpen
      : false;
    console.log('open ? ' + this.isOpen);
  }
  constructor(private elRef: ElementRef) {}
}*/

import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target)
      ? !this.isOpen
      : false;
    let part = this.elRef.nativeElement.querySelector('.dropdown-menu');
    if (this.isOpen) this.renderer.addClass(part, 'show');
    else this.renderer.removeClass(part, 'show');
  }
  constructor(private elRef: ElementRef, private renderer: Renderer2) {}
}
