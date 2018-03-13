import { Component, OnInit, ViewEncapsulation, Input, ElementRef, ViewChild } from '@angular/core';

import {
    ActivatedRoute
} from '@angular/router';

import { ChartService } from '../../../core/services';

import * as dc from 'dc';

@Component({
    selector: 'select-menu',
    templateUrl: './select-menu-view.component.html',
    styleUrls: [ './select-menu-view.component.scss' ]
})
export class SelectMenuViewComponent implements OnInit {
    @Input() label: string;
    @Input() chart: any;

    @ViewChild('sm') selectMenu: ElementRef;

    constructor(
        private route: ActivatedRoute,
        private chartService: ChartService
    ) { }

    ngOnInit() {
        if (!this.label) {
            this.route.params.subscribe(params => {
                this.label = params['label'];
                this.initChart();
            });
        } else {
            this.initChart();
        }

    }

    initChart() {
        this.chart = dc.selectMenu(this.selectMenu.nativeElement)
            .dimension(this.chartService.getDimension(this.label))
            // Add group also as input later on
            .group(this.chartService.getGroup(this.label))
            .controlsUseVisibility(true);

        this.chart.render();
    }
}
