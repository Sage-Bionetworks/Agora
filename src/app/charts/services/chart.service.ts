import { Injectable } from '@angular/core';

import * as d3 from 'd3';
import * as dc from 'dc';

import { Subject } from 'rxjs';

@Injectable()
export class ChartService {
    chartInfos: Map<string, any> = new Map<string, any>();
    chartNames: Map<string, boolean> = new Map([
        ['median-chart', false],
        ['box-plot', false],
        ['forest-plot', false],
        ['select-model', false]
    ]);
    chartRendered: Map<string, boolean> = new Map([
        ['median-chart', false],
        ['box-plot', false],
        ['forest-plot', false],
        ['select-model', false]
    ]);
    pChartInfos: Map<string, any> = new Map<string, any>();
    pChartNames: Map<string, boolean> = new Map([
        ['pbox-plot', false],
        ['select-protein', true]
    ]);
    tissueToFilter: string = '';
    modelToFilter: string = '';
    queryFilter: any = {
        smGroup: null,
        bpGroup: null,
        fpGroup: null,
        mcGroup: null
    };
    pQueryFilter: any = {
        spGroup: null,
        bpGroup: null
    };
    filteredData: any = null;

    // Observable string sources
    chartsReadySource = new Subject<boolean>();
    chartsRenderedSource = new Subject<boolean>();

    // Observable string streams
    chartsReady$ = this.chartsReadySource.asObservable();
    chartsRendered$ = this.chartsRenderedSource.asObservable();

    constructor() {
        //
    }

    addChartInfo(label: string, chartObj: any, type: string = 'RNA') {
        let chartInfos: Map<string, any> = null;
        if (type === 'RNA') {
            chartInfos = this.chartInfos;
        } else if (type === 'Proteomics') {
            chartInfos = this.pChartInfos;
        }

        if (chartInfos) {
            if (label && !chartInfos.has(label)) { chartInfos.set(label, chartObj); }
        }
    }

    addChartName(name: string, type: string = 'RNA') {
        let chartNames: Map<string, boolean> = null;
        if (type === 'RNA') {
            chartNames = this.chartNames;
        } else if (type === 'Proteomics') {
            chartNames = this.pChartNames;
        }

        if (chartNames) {
            if (name && chartNames.has(name)) { chartNames.set(name, true); }

            if (this.allChartsLoaded(type)) {
                this.chartsReadySource.next(true);
            } else {
                this.chartsReadySource.next(false);
            }
        }
    }

    addChartRendered(name: string) {
        if (this.chartRendered) {
            if (name && this.chartRendered.has(name)) { this.chartRendered.set(name, true); }

            if (this.allChartsRendered()) {
                this.chartsRenderedSource.next(true);
            } else {
                this.chartsRenderedSource.next(false);
            }
        }
    }

    removeChartName(name: string, type: string = 'RNA') {
        let chartNames: Map<string, boolean> = null;
        if (type === 'RNA') {
            chartNames = this.chartNames;
        } else if (type === 'Proteomics') {
            chartNames = this.pChartNames;
        }

        if (name && chartNames.has(name)) {
            chartNames.set(name, false);
            this.chartsReadySource.next(false);
        }

        if (this.allEmptyCharts(type)) {
            d3.selectAll('dc-chart').remove();
            dc.chartRegistry.clear();
        }
    }

    removeChartRendered(name: string) {
        if (name && this.chartRendered.has(name)) {
            this.chartRendered.set(name, false);
            this.chartsRenderedSource.next(false);
        }
    }

    allEmptyCharts(type: string = 'RNA'): boolean {
        let allEmpty = true;
        let chartNames: Map<string, boolean> = null;
        if (type === 'RNA') {
            chartNames = this.chartNames;
        } else if (type === 'Proteomics') {
            chartNames = this.pChartNames;
        }

        for (const value of chartNames.values()) {
            if (value) {
                allEmpty = false;
                break;
            }
        }

        return allEmpty;
    }

    allChartsLoaded(type: string = 'RNA'): boolean {
        let loaded = true;
        let chartNames: Map<string, boolean> = null;
        if (type === 'RNA') {
            chartNames = this.chartNames;
        } else if (type === 'Proteomics') {
            chartNames = this.pChartNames;
        }

        for (const value of chartNames.values()) {
            if (!value) {
                loaded = false;
                break;
            }
        }

        return loaded;
    }

    allChartsRendered(): boolean {
        let loaded = true;

        for (const value of this.chartRendered.values()) {
            if (!value) {
                loaded = false;
                break;
            }
        }

        return loaded;
    }

    getChartInfo(label: string, type: string = 'RNA'): any {
        let chartInfos: Map<string, any> = null;
        if (type === 'RNA') {
            chartInfos = this.chartInfos;
        } else if (type === 'Proteomics') {
            chartInfos = this.pChartInfos;
        }

        return chartInfos.get(label);
    }

    removeChart(chart: any, group?: any, dimension?: any) {
        if (chart) {
            if (group) {
                chart.filterAll(group);
            }
            if (dimension) {
                dimension.filterAll();
            }
            dc.chartRegistry.deregister(chart);
        }
    }

    getTooltipText(text: string): string {
        switch (text) {
            case 'CBE':
                return 'Cerebellum';
            case 'DLPFC':
                return 'Dorsolateral Prefrontal Cortex';
            case 'FP':
                return 'Frontal Pole';
            case 'IFG':
                return 'Inferior Frontal Gyrus';
            case 'PHG':
                return 'Parahippocampal Gyrus';
            case 'STG':
                return 'Superior Temporal Gyrus';
            case 'TCX':
                return 'Temporal Cortex';
            case 'AntPFC':
                return 'Anterior Prefrontal Cortex';
            case 'MFG':
                return 'Middle Frontal Gyrus';
            case 'BRAAK':
                return 'Neurofibrillary Tangles';
            case 'CERAD':
                return 'Neuritic Plaques';
            case 'COGDX':
                return 'Clinical Consensus Diagnosis';
            case 'DCFDX':
                return 'Clinical Cognitive Diagnosis';
            case 'ACC':
                return 'Anterior Cingulate Cortex';
            case 'PCC':
                return 'Posterior Cingulate Cortex';
            default:
                return '';
        }
    }
}
