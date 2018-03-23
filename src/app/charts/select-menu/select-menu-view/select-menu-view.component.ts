import { Component, OnInit, ViewEncapsulation, Input, ElementRef, ViewChild } from '@angular/core';

import {
    ActivatedRoute
} from '@angular/router';

import { ChartService } from '../../services';
import { GeneService, DataService } from '../../../core/services';

import * as d3 from 'd3';
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
    @Input() info: any;
    @Input() promptText: string;
    @Input() filterStrings: string[] = [];
    @Input() defaultValue: string;

    @ViewChild('sm') selectMenu: ElementRef;

    isDisabled: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private dataService: DataService,
        private geneService: GeneService,
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
        this.info = this.chartService.getChartInfo(this.label);
        let currentGene = this.geneService.getCurrentGene();
        let filterTissues = this.geneService.getTissues();
        let filterModels = this.geneService.getModels();
        let dim = this.dataService.getDimension(this.label, this.info, currentGene, filterTissues, filterModels);
        let group = this.dataService.getGroup(this.label, this.info);

        this.chart = dc.selectMenu(this.selectMenu.nativeElement)
            .dimension(dim)
            .group(group)
            .controlsUseVisibility(true)
            .on('filtered', function(chart, filter) {
                // Do something else?
                self.isDisabled = (!filter) ? true : false;
            });
        this.chart.promptText(this.promptText);

        // Improve this later
        this.chart.on('postRender', function(chart) {
            if (self.defaultValue) {
                let selectMenu = d3.select(self.selectMenu.nativeElement)
                    .select('select.dc-select-menu')
                let options = selectMenu
                    .selectAll('option');
                let defaultOption = options[0]['find'](o => {
                    return (o['innerHTML'].includes(self.defaultValue));
                });
                if (defaultOption) {
                    defaultOption['selected'] = 'selected';
                } else {
                    options[0][1]['selected'] = 'selected';
                }
                selectMenu.node().dispatchEvent(new Event('change'));
                self.defaultValue = '';
            }
        });

        this.chart.render();
    }

    filterAll() {
        (this.filterStrings.length) ? this.chart.filterAll(this.filterStrings) : this.chart.filterAll();
        dc.redrawAll();
        this.isDisabled = true;
    }
}
