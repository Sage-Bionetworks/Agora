import { Component, ViewEncapsulation, Input } from '@angular/core';
import { DialogsService } from '../services';

import { NavigationService } from '../../core/services';

@Component({
    selector: 'pt-dialog',
    templateUrl: './pt-dialog.component.html',
    styleUrls: ['./pt-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PTDialogComponent {
    @Input() display: boolean = false;
    @Input() description: boolean = false;
    @Input() header: string = '';
    @Input() name: string = 'pt';

    constructor(
        private dialogsService: DialogsService,
        private navService: NavigationService
    ) {
        dialogsService.displayed$.subscribe((visibleObj: any) => {
            if (visibleObj && visibleObj.name && visibleObj.name === this.name) {
                this.display = (visibleObj.visible) ? visibleObj.visible : false;
            }
        });
    }

    // Waiting for the new PrimeNG version
    closeDialog() {
        this.dialogsService.closeDialog(this.name);
    }

    goToRoute(path: string, outlets?: any) {
        this.navService.goToRouteRelative(path, outlets);
    }
}
