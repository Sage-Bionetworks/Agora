import { Component, ViewEncapsulation, Input } from '@angular/core';

import { DialogsService } from '../services';

@Component({
    selector: 'dg-dialog',
    templateUrl: './dg-dialog.component.html',
    styleUrls: ['./dg-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DRUggabilityComponent {
    @Input() display: boolean = false;
    @Input() description: boolean = false;
    @Input() header: string = '';
    @Input() name: string = 'dg';

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
