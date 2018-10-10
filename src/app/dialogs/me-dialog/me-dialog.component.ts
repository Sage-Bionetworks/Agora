import { Component, ViewEncapsulation, Input } from '@angular/core';

import { DialogsService } from '../services';

@Component({
    selector: 'me-dialog',
    templateUrl: './me-dialog.component.html',
    styleUrls: [ './me-dialog.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class MEDialogComponent {
    @Input() display: boolean = false;
    @Input() description: boolean = false;
    @Input() header: string = '';
    @Input() name: string = 'me';

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
