import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
    selector: '[validateOnBlur]'
})
export class FocusDirective {
    @HostListener('focus', ['$event.target'])
        onFocus(target) {
            console.log('Focus called.');
        }
    @HostListener('focusout', ['$event.target'])
        onFocusout(target) {
            console.log('Focus out called.');
        }
}
