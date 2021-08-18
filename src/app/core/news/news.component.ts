import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'news',
    templateUrl: './news.component.html',
    styleUrls: [ './news.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class NewsComponent {

    wikiId = '611426';
    classNames = 'news-container';

    constructor() {
        // empty
    }
}
