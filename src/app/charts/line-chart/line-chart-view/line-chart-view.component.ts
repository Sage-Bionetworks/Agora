import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import {
    Router,
    ActivatedRoute
} from '@angular/router';

@Component({
    selector: 'line-chart',
    templateUrl: './line-chart-view.component.html',
    styleUrls: [ './line-chart-view.component.scss' ]
})
export class LineChartViewComponent implements OnInit {

    constructor(
        private router : Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets], {relativeTo: this.route}) : this.router.navigate([path], {relativeTo: this.route});
    }
}
