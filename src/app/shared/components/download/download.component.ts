import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/primeng';

@Component({
    selector: 'download',
    templateUrl: './download.component.html',
    styleUrls: [ './download.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class DownloadComponent implements OnInit {
    @ViewChild('op') overlayPanel: OverlayPanel;
    selectedTypes: string[] = ['png'];
    types: any[] = [];

    private resizeTimer;

    constructor() {
        //
    }

    ngOnInit() {
        // Populate the options for our download menu
        this.initDownloadMenu();
    }

    initDownloadMenu() {
        this.types.push({
            value: 'png',
            label: 'PNG'
        });
    }

    hide() {
        this.overlayPanel.hide();
    }

    downloadWidget() {
        //
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
