import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'genes-intro',
    templateUrl: './genes-intro.component.html',
    styleUrls: [ './genes-intro.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GenesIntroComponent {
    display: boolean = false;
    showVideo: boolean = false;

    constructor(
        private router: Router
    ) {}

    showDialog() {
        this.display = true;
    }

    playVideo() {
        this.showVideo = true;
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets]) : this.router.navigate([path]);
    }
}
