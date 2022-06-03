import {
    Component,
    OnInit,
    Input,
    ViewEncapsulation,
    ViewChildren,
    ViewContainerRef,
    QueryList,
    ViewChild,
    ElementRef,
    AfterViewChecked
} from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';

import { Gene, GeneInfo, GeneResponse } from '../../../../../models';

import { emptyGene } from 'app/testing';

import { ChartService } from '../../../../../charts/services';
import {
    ApiService,
    GeneService,
    DataService
} from '../../../../../core/services';

import { SelectItem } from 'primeng/api';

import { Subscription } from 'rxjs';

@Component({
    selector: 'gene-rnaseq-de',
    templateUrl: './gene-rnaseq-de.component.html',
    styleUrls: [ './gene-rnaseq-de.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneRNASeqDEComponent implements OnInit, AfterViewChecked {
    @Input() styleClass: string = 'rnaseq-panel';
    @Input() style: any;
    @Input() gene: Gene = emptyGene;
    @Input() geneInfo: GeneInfo;
    @Input() id: string;
    @ViewChild('noDataMedian', {static: false}) noMedianEl: ElementRef;
    @ViewChildren('t', { read: ViewContainerRef }) entries: QueryList<ViewContainerRef>;

    tissues: SelectItem[] = [];
    models: SelectItem[] = [];
    emptySelection: SelectItem[] = [];
    currentTissues: string[] = [];
    selectedTissues: string[] = [];
    selectedModels: string[] = [];
    componentRefs: any[] = [];
    oldIndex: number = -1;
    index: number = -1;
    dropdownIconClass: string = 'fa fa-caret-down';
    emptySelectionLabel: string = '- - -';
    emptySelectionValue: string = '';
    dataLoaded: boolean = false;
    displayBPDia: boolean = false;
    displayBRDia2: boolean = false;
    isEmptyGene: boolean = true;
    hasMedianExpression: boolean = false;
    isViewReady: boolean = false;
    canFilter: boolean = false;
    chartSubscription: Subscription;

    constructor(
        private router: Router,
        private apiService: ApiService,
        private geneService: GeneService,
        private dataService: DataService,
        private chartService: ChartService,
        private location: PlatformLocation
    ) { }

    ngOnInit() {
        this.gene = this.geneService.getCurrentGene();
        this.geneInfo = this.geneService.getCurrentInfo();
        this.emptySelection.push({
            label: this.emptySelectionLabel,
            value: this.emptySelectionValue
        });

        this.location.onPopState(() => {
            this.isEmptyGene = true;
        });

        // Registers all the charts and loads data
        this.initData();
    }

    ngAfterViewChecked() {
        this.isViewReady = true;
    }

    initData() {
        this.registerCharts().then((status) => {
            const rTissues = this.geneService.getGeneTissues().sort();
            rTissues.forEach((t) => {
                this.tissues.push({label: t.toUpperCase(), value: t});
            });
            const rModels = this.geneService.getGeneModels().sort();
            rModels.forEach((t) => {
                this.models.push({label: t.toUpperCase(), value: t});
            });
            const index = this.tissues.findIndex((t) => {
                return t.value === this.geneService.getDefaultTissue();
            });
            this.index = index;
            this.selectedTissues = (index !== -1) ?
                this.tissues.slice(index, index + 1).map((a) => a.value) :
                this.tissues.slice(0, 1).map((a) => a.value);

            this.selectedModels = this.models.slice(0, 1).map((a) => a.value);

            this.geneService.setDefaultTissue(this.selectedTissues[0]);
            this.geneService.setDefaultModel(this.selectedModels[0]);

            this.geneService.updateEmptyGeneState();
            this.isEmptyGene = this.geneService.getEmptyGeneState();
            this.hasMedianExpression = this.geneService.hasMedianExpression();

            this.dataLoaded = true;
        });
    }

    registerCharts(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.chartService.addChartInfo(
                'forest-plot',
                {
                    dimension: ['tissue'],
                    group: 'self',
                    type: 'forest-plot',
                    title: 'Log fold forest plot',
                    filter: 'default',
                    attr: 'logfc'
                }
            );
            this.chartService.addChartInfo(
                'select-model',
                {
                    dimension: ['model'],
                    group: 'self',
                    type: 'select-menu',
                    title: '',
                    filter: 'default'
                }
            );
            this.registerBoxPlot(
                'box-plot',
                [
                    {
                        name: this.currentTissues[this.index],
                        attr: 'tissue'
                    },
                    {
                        name: this.geneService.getCurrentModel(),
                        attr: 'model'
                    }
                ],
                'LOG 2 FOLD CHANGE',
                'fc'
            );

            resolve(true);
        });
    }

    getDownloadFileName(suffix: string, includeModel: boolean = false): string {
        const model = includeModel ? ('_' + this.geneService.getCurrentModel()) : '';
        return (this.gene.hgnc_symbol || this.gene.ensembl_gene_id) +
        '_' + suffix + model;
    }

    registerBoxPlot(
        label: string, constraints: any[], yAxisLabel: string, attr: string, type: string = 'RNA'
    ) {
        this.chartService.addChartInfo(
            label,
            {
                dimension: ['tissue', 'model'],
                group: 'self',
                type: 'box-plot',
                title: '',
                filter: 'default',
                xAxisLabel: '',
                yAxisLabel,
                format: 'array',
                attr,
                constraints
            },
            type
        );
    }

    getDropdownIcon(): string {
        return this.dropdownIconClass;
    }
}
