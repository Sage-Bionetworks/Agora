import {
    Component,
    ViewEncapsulation,
    Input
} from '@angular/core';

import { DialogsService } from '../services';

@Component({
    selector: 'soe-dialog',
    templateUrl: './soe-dialog.component.html',
    styleUrls: [ './soe-dialog.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class SOEDialogComponent {
    @Input() display: boolean = false;
    @Input() name: string = 'soe';

    constructor(private dialogsService: DialogsService) {
        dialogsService.displayed$.subscribe((visibleObj: any) => {
            if (visibleObj && visibleObj.name && visibleObj.name === this.name) {
                this.display = (visibleObj.visible) ? visibleObj.visible : false;
            }
        });
    }

    // Waiting for the new PrimeNG version
    closeDialog() {
        console.log('close');
        this.dialogsService.closeDialog(this.name);
    }
}
