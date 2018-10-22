import { Component, ViewEncapsulation, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogsService } from '../services';

@Component({
    selector: 'nt-dialog',
    templateUrl: './nt-dialog.component.html',
    styleUrls: ['./nt-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NOMinatedTargetComponent {
    @Input() display: boolean = false;
    @Input() description: boolean = false;
    @Input() header: string = '';
    @Input() name: string = 'nt';

    constructor(private dialogsService: DialogsService,
                private router: Router,
                private route: ActivatedRoute) {
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

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets], { relativeTo: this.route }) :
            this.router.navigate([path], { relativeTo: this.route });
    }
}
