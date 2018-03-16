import { Component, OnInit, ViewEncapsulation, Input, ElementRef, ViewChild } from '@angular/core';

import {
    ActivatedRoute
} from '@angular/router';

import { ChartService } from '../../../core/services';

import * as dc from 'dc';

@Component({
    selector: 'select-menu',
    templateUrl: './select-menu-view.component.html',
    styleUrls: [ './select-menu-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class SelectMenuViewComponent implements OnInit {
    @Input() label: string;
    @Input() chart: any;
    @Input() promptText: string;
    @Input() filterStrings: string[] = [];

    @ViewChild('sm') selectMenu: ElementRef;

    isDisabled: boolean = true;

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
        let self = this;
        this.chart = dc.selectMenu(this.selectMenu.nativeElement)
            .dimension(this.chartService.getDimension(this.label))
            .group(this.chartService.getGroup(this.label))
            .controlsUseVisibility(true)
            .on('filtered', function(chart, filter) {
                // Do something else?
                self.isDisabled = (!filter) ? true : false;
            });
        this.chart.promptText(this.promptText);

        this.chart.render();
    }

    filterAll() {
        (this.filterStrings.length) ? this.chart.filterAll(this.filterStrings) : this.chart.filterAll();
        dc.redrawAll();
        this.isDisabled = true;
    }
}
