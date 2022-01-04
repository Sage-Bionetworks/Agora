import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'news',
    templateUrl: './news.component.html',
    styleUrls: [ './news.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class NewsComponent {
    ownerId = 'syn25913473';
    wikiId = '611426';
    classNames = 'news-container';

    constructor() {
        // empty
    }
}
