import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';

import {
    ActivatedRoute
} from '@angular/router';

import { Gene } from '../../../models';

import { ChartService } from '../../services';
import { DataService, GeneService } from '../../../core/services';

import * as d3 from 'd3';

@Component({
    selector: 'force-chart',
    templateUrl: './force-chart-view.component.html',
    styleUrls: ['./force-chart-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ForceChartViewComponent implements OnInit {
    @Input() private title: string;

    @ViewChild('chart') private forceChart: ElementRef;

    public constructor() {
        console.log('construct force');
        
    }
    public ngOnInit() {
        const width = '650px';
        const height = '300px';
        console.log('init force');
        d3.select(this.forceChart.nativeElement)
            .attr('width', width)
            .attr('height', height);

        const simulation = d3.forceSimulation()
            .force('charge', d3.forceManyBody().strength(-20))
            .force('center', d3.forceCenter(width / 2, height / 2))
    }
}
