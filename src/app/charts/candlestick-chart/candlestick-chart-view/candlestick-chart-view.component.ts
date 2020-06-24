import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Input,
    OnDestroy,
    AfterViewInit,
    AfterContentChecked
} from '@angular/core';

import {PlatformLocation} from '@angular/common';
import {Router, NavigationStart} from '@angular/router';
import {ChartService} from '../../services';
import {DataService, GeneService} from '../../../core/services';
import {Subscription} from 'rxjs';
import * as d3 from 'd3';

@Component({
    selector: 'candlestick-chart',
    templateUrl: './candlestick-chart-view.component.html',
    styleUrls: ['./candlestick-chart-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CandlestickChartViewComponent implements OnInit, OnDestroy, AfterViewInit,
    AfterContentChecked {

    @ViewChild('chart', {static: false}) candleStickChart: ElementRef;

    constructor(
        private location: PlatformLocation,
        private router: Router,
        private dataService: DataService,
        private geneService: GeneService,
        private chartService: ChartService
    ) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    ngAfterViewInit() {
    }

    ngAfterContentChecked() {
    }

    getModel(): string {
        return '';
    }

    onResize() {
    }

}
