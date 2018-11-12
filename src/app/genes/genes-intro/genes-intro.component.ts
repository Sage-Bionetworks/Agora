import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'genes-intro',
    templateUrl: './genes-intro.component.html',
    styleUrls: [ './genes-intro.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GenesIntroComponent {
    display: boolean = false;
    showVideo: boolean = false;

    showDialog() {
        this.display = true;
    }

    playVideo() {
        this.showVideo = true;
    }
}
