import { Directive, Input, HostListener } from '@angular/core';

@Directive({
    selector: '[routerLink]'
})
export class RouterLinkStubDirective {
    @Input() linkParams: string;
    navigatedTo: any = null;

    @HostListener('click') onClick() {
        this.navigatedTo = this.linkParams;
    }
}
