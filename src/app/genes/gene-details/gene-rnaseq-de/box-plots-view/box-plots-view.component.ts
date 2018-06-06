import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { Gene } from '../../../../models';

import { GeneService } from '../../../../core/services';

import { Observable } from 'rxjs/Observable';
import { SelectItem } from 'primeng/api';

@Component({
    selector: 'box-plots-view',
    templateUrl: './box-plots-view.component.html',
    styleUrls: [ './box-plots-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class BoxPlotsViewComponent {
    @Input() tissue: string = '';
    @Input() label1: string = '';
    @Input() label2: string = '';
    @Input() info1: any;
    @Input() info2: any;
}
