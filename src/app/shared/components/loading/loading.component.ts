import { Component, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'loading',
    templateUrl: './loading.component.html',
    styleUrls: [ './loading.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class LoadingComponent {
    videoTag: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
        // Better to leave this inside the constructor and
        // not inside ngOnInit()
        this.videoTag = this.getVideoTag();
    }

    private getVideoTag(): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(
            `<video class="loading-video" id="vd" width="200" height="200" muted loop
                autoplay playsinline disableRemotePlayback>
                <source src="/assets/video/loading.mov" type="video/mp4">
                Your browser does not support the video tag.
            </video>`
        );
    }
}
