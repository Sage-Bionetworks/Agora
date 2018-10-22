import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'box-plots-view',
    templateUrl: './box-plots-view.component.html',
    styleUrls: [ './box-plots-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class BoxPlotsViewComponent {
    @Input() tissue: string = '';
    @Input() model: string = '';
    @Input() label1: string = '';
    @Input() label2: string = '';
    @Input() info1: any;
    @Input() info2: any;
}
