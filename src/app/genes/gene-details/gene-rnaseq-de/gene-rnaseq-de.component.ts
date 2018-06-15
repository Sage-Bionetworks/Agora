import {
    Component,
    OnInit,
    Input,
    ViewEncapsulation,
    ViewChild,
    ViewChildren,
    ViewContainerRef,
    ComponentFactoryResolver,
    ComponentRef,
    ComponentFactory,
    QueryList
} from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { BoxPlotsViewComponent } from './box-plots-view';

import { Gene } from '../../../models';

import { ChartService } from '../../../charts/services';
import { GeneService, DataService } from '../../../core/services';

import { Observable } from 'rxjs/Observable';
import { SelectItem } from 'primeng/api';
import { entries, lab } from 'd3';

@Component({
    selector: 'gene-rnaseq-de',
    templateUrl: './gene-rnaseq-de.component.html',
    styleUrls: [ './gene-rnaseq-de.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneRNASeqDEComponent implements OnInit {
    @Input() styleClass: string = 'rnaseq-panel';
    @Input() style: any;
    @Input() gene: Gene;
    @Input() id: string;
    @ViewChildren('t', { read: ViewContainerRef }) entries: QueryList<ViewContainerRef>;
    dataLoaded: boolean = false;
    tissues: SelectItem[] = [];
    currentTissues: string[] = [];
    selectedTissues: string[] = [];
    componentRefs: any[] = [];
    oldIndex: number = -1;
    index: number = -1;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private geneService: GeneService,
        private dataService: DataService,
        private chartService: ChartService,
        private location: Location,
        private resolver: ComponentFactoryResolver
    ) { }

    ngOnInit() {
        if (!this.gene) { this.gene = this.geneService.getCurrentGene(); }

        // The data wasn't loaded yet, redirect for now
        if (!this.dataService.getNdx()) {
            this.id = this.route.snapshot.paramMap.get('id');
            this.router.navigate([
                '/genes',
                {
                    outlets: {
                        'genes-router':
                        [
                            'gene-details', this.id
                        ]
                    }
                }
            ]);
        } else {
            this.loadChartData().then((status) => {
                this.geneService.getTissues().forEach((t) => {
                    this.tissues.push({label: t.toUpperCase(), value: t});
                });
                this.dataLoaded = status;
            });
        }
    }

    loadChartData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.chartService.addChartInfo(
                'volcano-plot',
                {
                    dimension: ['logfc', 'adj_p_val', 'hgnc_symbol'],
                    group: 'self',
                    type: 'scatter-plot',
                    title: 'Volcano Plot',
                    xAxisLabel: 'Log Fold Change',
                    yAxisLabel: '-log10(Adjusted p-value)',
                    x: ['logfc'],
                    y: ['adj_p_val']
                }
            );
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
                'select-tissue',
                {
                    dimension: ['tissue'],
                    group: 'self',
                    type: 'select-menu',
                    title: '',
                    filter: 'default'
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

            resolve(true);
        });
    }

    getTissue(index: number) {
        return this.geneService.getTissues()[index];
    }

    getModel(index: number) {
        return this.geneService.getModels()[index];
    }

    toggleTissue(event: any) {
        this.index = this.tissues.findIndex((t) => t.value === event.itemValue);
        const LIMIT_NUMBER = 1;
        const hasTissue = (this.currentTissues[this.index]) ? true : false;
        // Create or destroy the box plots for this tissue
        if (!hasTissue) {
            this.currentTissues[this.index] = event.itemValue;
            // Remove the old box plot and erase the index
            if (this.oldIndex !== -1) {
                this.destroyComponent(this.oldIndex);
                if (this.index !== this.oldIndex) {
                    this.currentTissues[this.oldIndex] = undefined;
                }
            }

            const label1 = 'box-plot-' + this.index + '1';
            const label2 = 'box-plot-' + this.index + '2';
            const info1 = this.chartService.getChartInfo(label1);
            const info2 = this.chartService.getChartInfo(label2);
            if (!info1) {
                this.registerBoxPlot(
                    'box-plot-' + this.index + '1',
                    [this.currentTissues[this.index]],
                    'log2(fold change)',
                    'logfc'
                );
            }
            if (!info2) {
                this.registerBoxPlot(
                    'box-plot-' + this.index + '2',
                    [this.currentTissues[this.index]],
                    '-log10(adjusted p-value)',
                    'adj_p_val'
                );
            }

            this.createComponent(this.index, info1, info2, label1, label2);
        } else {
            this.destroyComponent(this.index);
            this.currentTissues[this.index] = undefined;
        }

        this.oldIndex = this.index;
        if (event.value.length > LIMIT_NUMBER) { event.value.splice(0, 1); }
    }

    registerBoxPlot(label: string, constraintNames: string[], yAxisLabel: string, attr: string) {
        this.chartService.addChartInfo(
            label,
            {
                dimension: ['tissue'],
                group: 'self',
                type: 'box-plot',
                title: '',
                filter: 'default',
                xAxisLabel: '',
                yAxisLabel,
                format: 'array',
                attr,
                constraintNames
            }
        );
    }

    createComponent(index: number, info1: any, info2: any, label1: string, label2: string) {
        const eArray = this.entries.toArray();
        if (this.componentRefs[index]) { eArray[index].clear(); }
        const factory = this.resolver.resolveComponentFactory(BoxPlotsViewComponent);
        this.componentRefs[index] = eArray[index].createComponent(factory);
        this.componentRefs[index].instance.tissue = this.tissues[index].value;
        this.componentRefs[index].instance.label1 = label1;
        this.componentRefs[index].instance.label2 = label2;
        this.componentRefs[index].instance.info1 = info1;
        this.componentRefs[index].instance.info2 = info2;
    }

    destroyComponent(index: number) {
        this.componentRefs[index].destroy();
    }

    goBack() {
        this.location.back();
    }
}
