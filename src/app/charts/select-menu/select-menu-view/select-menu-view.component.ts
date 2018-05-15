import { Component, OnInit, ViewEncapsulation, Input, ElementRef, ViewChild } from '@angular/core';

import {
    ActivatedRoute
} from '@angular/router';

import { ChartService } from '../../services';
import { GeneService, DataService } from '../../../core/services';

import * as d3 from 'd3';
import * as dc from 'dc';
// import { selectMenu, redrawAll } from 'dc';

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
    @Input() currentGene = this.geneService.getCurrentGene();
    @Input() tissues = this.geneService.getTissues();
    @Input() models = this.geneService.getModels();
    @Input() dim: any;
    @Input() group: any;

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
            this.route.params.subscribe((params) => {
                this.label = params['label'];
                this.initChart();
            });
        } else {
            this.initChart();
        }
    }

    initChart() {
        const self = this;
        this.info = this.chartService.getChartInfo(this.label);
        this.dim = this.dataService.getDimension(this.label, this.info);

        this.chart = dc.selectMenu(this.selectMenu.nativeElement)
            .dimension(this.dim)
            .group(this.dim.group())
            .controlsUseVisibility(true)
            .on('filtered', function(chart, filter) {
                if (self.label === 'select-tissue') self.geneService.setCurrentTissue(filter);
                if (self.label === 'select-model') self.geneService.setCurrentModel(filter);
                self.isDisabled = (filter) ? false : true;
            });
        this.chart.promptText(this.promptText);

        this.chart.on('postRender', function(chart) {
            if (self.defaultValue) {
                const selectMenu = d3.select(self.selectMenu.nativeElement)
                    .select('select.dc-select-menu');
                const options = selectMenu
                    .selectAll('option');
                const defaultOption = options['_groups']['forEach']((o, i) => {
                    return (o[i]['innerHTML'].includes(self.defaultValue));
                });
                if (defaultOption) {
                    defaultOption['selected'] = 'selected';
                } else {
                    options['_groups'][0][0]['selected'] = 'selected';
                }
                //selectMenu.dispatch('change');
                options.filter(function(d, i) { return i == 0; }).remove();
                selectMenu.node().dispatchEvent(new Event('change'));
                self.defaultValue = '';
            }
        });

        this.chart.render();
    }

    filterAll() {
        this.chart.filterAll((this.filterStrings.length) ? this.filterStrings : null);
        dc.redrawAll();
        this.isDisabled = true;
    }
}
