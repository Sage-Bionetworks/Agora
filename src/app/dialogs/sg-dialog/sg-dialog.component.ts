import {
    Component,
    ViewEncapsulation,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import { DialogsService } from '../services';

@Component({
    selector: 'sg-dialog',
    templateUrl: './sg-dialog.component.html',
    styleUrls: [ './sg-dialog.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class SGDialogComponent {
    @Input() display: boolean = false;
    @Input() name: string = 'sg';

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
