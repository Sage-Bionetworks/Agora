import { Component, ViewEncapsulation, ViewChild, Input, OnInit } from '@angular/core';

import { OverlayPanel } from 'primeng/overlaypanel';
import { MessageService } from 'primeng/api';

import * as domtoimage from 'dom-to-image-more';
import { saveAs } from 'file-saver';

@Component({
    selector: 'download',
    templateUrl: './download.component.html',
    styleUrls: [ './download.component.scss' ],
    providers: [ MessageService ],
    encapsulation: ViewEncapsulation.None
})
export class DownloadComponent implements OnInit {
    @Input() target: HTMLElement;
    @Input() name: string = 'example';
    @ViewChild('op', {static: false}) overlayPanel: OverlayPanel;
    selectedType: any = null;
    types: any[] = [
        {
            value: '.png',
            label: 'PNG'
        },
        {
            value: '.jpeg',
            label: 'JPEG'
        }
    ];
    displayDialog: boolean = false;

    private resizeTimer;

    constructor(private messageService: MessageService) {}

    ngOnInit() {
        this.selectedType = this.types[0].value;
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
                domtoimage.toBlob(this.target, { bgcolor: '#FFFFFF' }).then((blob) => {
                    this.displayDialog = false;
                    saveAs(blob, this.name + this.selectedType);
                });
            } else {
                this.messageService.clear();
                this.messageService.add({
                    severity: 'warn',
                    sticky: true,
                    summary: 'Could not start download.',
                    detail: 'Plot to be downloaded not found!'
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

    setType(selectedType: string) {
        this.selectedType = selectedType;
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
