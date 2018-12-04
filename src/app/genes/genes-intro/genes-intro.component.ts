import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    selector: 'genes-intro',
    templateUrl: './genes-intro.component.html',
    styleUrls: [ './genes-intro.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GenesIntroComponent implements OnInit {
    display: boolean = false;
    showVideo: boolean = true;

    constructor(
        private localSt: LocalStorageService
    ) {}

    ngOnInit() {
        this.localSt.observe('showVideo').subscribe((value) => {
            this.showVideo = value;
        });

        this.updateState();
    }

    updateState() {
        // Test if the user has visited this site before
        if (this.localSt.retrieve('hasVisited') !== true) {
            this.localSt.store('hasVisited', true);
            this.localSt.store('showVideo', true);
        } else {
            this.localSt.store('showVideo', false);
        }
    }

    showDialog() {
        this.display = true;
    }

    playVideo() {
        this.showVideo = true;
    }
}
