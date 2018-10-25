import {
    Component,
    ViewEncapsulation,
    Input
} from '@angular/core';

import { DialogsService } from '../services';

@Component({
    selector: 'sp-dialog',
    templateUrl: './sp-dialog.component.html',
    styleUrls: ['./sp-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SIMilarPageDialogComponent {
    @Input() display: boolean = false;
    @Input() name: string = 'sp';

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
