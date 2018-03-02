import { Component, OnInit, OnDestroy, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { VgAPI } from 'videogular2/core';

import { Gene } from '../../../../shared/models';

import { GeneService } from '../../../services';

@Component({
    selector: 'gene-nomination-video',
    templateUrl: './gene-nomination-video.component.html',
    styleUrls: [ './gene-nomination-video.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class GeneNominationVideoComponent implements OnInit {
    sources: Array<Object>;

    constructor(
        private router: Router,
        private geneService: GeneService
    ) {
        this.sources = [
            {
                src: "http://static.videogular.com/assets/videos/videogular.mp4",
                type: "video/mp4"
            },
            {
                src: "http://static.videogular.com/assets/videos/videogular.ogg",
                type: "video/ogg"
            },
            {
                src: "http://static.videogular.com/assets/videos/videogular.webm",
                type: "video/webm"
            }
        ];
    }

    ngOnInit() {
    }
}
