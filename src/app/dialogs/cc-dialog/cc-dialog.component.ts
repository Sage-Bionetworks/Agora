import { Component, ViewEncapsulation, Input } from '@angular/core';

import { DialogsService } from '../services';

@Component({
    selector: 'cc-dialog',
    templateUrl: './cc-dialog.component.html',
    styleUrls: [ './cc-dialog.component.scss' ],
    encapsulation: ViewEncapsulation.None
})

export class CCDialogComponent {

    @Input() display: boolean = false;
    @Input() name: string = 'cc';

    constructor(private dialogsService: DialogsService) {
        dialogsService.displayed$.subscribe((visibleObj: any) => {
            if (visibleObj && visibleObj.name && visibleObj.name === this.name) {
                this.display = (visibleObj.visible) ? visibleObj.visible : false;
            }
        });
    }

    closeDialog() {
        this.dialogsService.closeDialog(this.name);
    }

}
