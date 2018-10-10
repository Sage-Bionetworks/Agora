import { Component, ViewEncapsulation, ViewChild, Input } from '@angular/core';

import { OverlayPanel } from 'primeng/overlaypanel';
import { MessageService } from 'primeng/components/common/messageservice';

import * as domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

@Component({
    selector: 'download',
    templateUrl: './download.component.html',
    styleUrls: [ './download.component.scss' ],
    providers: [ MessageService ],
    encapsulation: ViewEncapsulation.None
})
export class DownloadComponent {
    @Input() target: HTMLElement;
    @Input() name: string = 'example';
    @ViewChild('op') overlayPanel: OverlayPanel;
    selectedTypes: string[] = ['png'];
    types: any[] = [
        {
            value: 'png',
            label: 'PNG'
        }
    ];
    displayDialog: boolean = false;

    private resizeTimer;

    constructor(private messageService: MessageService) {
        //
    }

    hide() {
        // Sets visible to false
        this.overlayPanel.hide();
    }

    downloadWidget() {
        // Close panel before the download
        this.overlayPanel.hide();

        // Check if the current browser is supported
        if (!!new Blob()) {
            if (this.target) {
                this.displayDialog = true;
                domtoimage.toBlob(this.target).then((blob) => {
                    this.displayDialog = false;
                    saveAs(blob, this.name + '.png');
                });
            } else {
                this.messageService.clear();
                this.messageService.add({
                    severity: 'warn',
                    sticky: true,
                    summary: 'Could not start download.',
                    detail: 'Widget to be downloaded not found!'
                });
            }
        } else {
            this.messageService.clear();
            this.messageService.add({
                severity: 'warn',
                sticky: true,
                summary: 'Could not start download.',
                detail: 'Your browser version is not supported, please update it.'
            });
        }
    }

    onRotate() {
        this.hide();
    }

    onResize() {
        const self = this;

        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(function() {
            self.hide();
        }, 0);
    }
}
