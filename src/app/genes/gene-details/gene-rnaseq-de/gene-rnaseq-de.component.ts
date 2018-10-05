import {
    Component,
    OnInit,
    Input,
    ViewEncapsulation,
    ViewChildren,
    ViewContainerRef,
    ComponentFactoryResolver,
    ComponentRef,
    QueryList,
    ViewChild,
    ElementRef,
    AfterViewInit
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BoxPlotsViewComponent } from './box-plots-view';

import { Gene, GeneInfo, GeneResponse } from '../../../models';

import { ChartService } from '../../../charts/services';
import { ApiService, DataService, GeneService } from '../../../core/services';

import { SelectItem } from 'primeng/api';

@Component({
    selector: 'gene-rnaseq-de',
    templateUrl: './gene-rnaseq-de.component.html',
    styleUrls: [ './gene-rnaseq-de.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneRNASeqDEComponent implements OnInit, AfterViewInit {
    @Input() styleClass: string = 'rnaseq-panel';
    @Input() style: any;
    @Input() gene: Gene;
    @Input() geneInfo: GeneInfo;
    @Input() id: string;
    @ViewChild('noDataMedian') noMedianEl: ElementRef;
    @ViewChildren('t', { read: ViewContainerRef }) entries: QueryList<ViewContainerRef>;
    tissues: SelectItem[] = [];
    emptySelection: SelectItem[] = [];
    currentTissues: string[] = [];
    selectedTissues: string[] = [];
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
    isViewReady: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private apiService: ApiService,
        private geneService: GeneService,
        private dataService: DataService,
        private chartService: ChartService,
        private resolver: ComponentFactoryResolver
    ) { }

    ngOnInit() {
        this.gene = this.geneService.getCurrentGene();
        this.geneInfo = this.geneService.getCurrentInfo();
        this.emptySelection.push({
            label: this.emptySelectionLabel,
            value: this.emptySelectionValue
        });

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
                this.geneService.getGeneTissues().forEach((t) => {
                    this.tissues.push({label: t.toUpperCase(), value: t});
                });
                const index = this.tissues.findIndex((t) => {
                    return t.value === this.geneService.getDefaultTissue();
                });
                this.selectedTissues = (index !== -1) ?
                    this.tissues.slice(index, index + 1).map((a) => a.value) :
                    this.tissues.slice(0, 1).map((a) => a.value);

                this.toggleTissue({
                    itemValue: this.selectedTissues[0],
                    value: [this.selectedTissues[0]]
                });
                this.dataLoaded = true;
                if (this.gene && this.gene._id) {
                    this.isEmptyGene = false;
                }
            });
        }
    }

    ngAfterViewInit() {
        this.isViewReady = true;
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
        return this.geneService.getGeneTissues()[index];
    }

    getModel(index: number) {
        return this.geneService.getGeneModels()[index];
    }

    getDefaultLabel(): string {
        return this.geneService.getDefaultTissue() ||
            (this.tissues.length ? this.tissues[0].value : '');
    }

    async toggleTissue(event: any) {
        // Update default tissue in case the user navigates away and comes back
        this.geneService.setDefaultTissue(event.itemValue);
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

            // Set the current tissue to the toggled value
            this.geneService.setCurrentTissue(event.itemValue);

            // Update the current gene for this tissue
            this.apiService.getGene(
                this.gene.ensembl_gene_id,
                this.geneService.getCurrentTissue(),
                this.geneService.getCurrentModel()
            ).subscribe(
                (data: GeneResponse) => {
                    if (!data.info) {
                        this.router.navigate(['/genes']);
                    } else {
                        if (!data['item']) {
                            // Fill in a new gene with the info attributes
                            data['item'] = this.geneService.getEmptyGene(
                                data['info'].ensembl_gene_id, data['info'].hgnc_symbol
                            );
                        }
                    }
                    this.geneService.updateGeneData(data);
                    this.gene = data.item;
                }, (error) => {
                    console.log('Error getting gene: ' + error.message);
                }, () => {
                    // Check if we have a database id at this point
                    if (this.gene && this.gene._id) {
                        const label1 = 'box-plot-' + this.index + '1';
                        const info1 = this.chartService.getChartInfo(label1);
                        if (!info1) {
                            this.registerBoxPlot(
                                'box-plot-' + this.index + '1',
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
                                'log2(fold change)',
                                'fc'
                            );
                        }

                        this.createComponent(this.index, info1, label1);
                    } else {
                        this.isEmptyGene = true;
                    }
                }
            );
        } else {
            this.destroyComponent(this.index);
            this.currentTissues[this.index] = undefined;

            // Set the current tissue to the toggled value
            this.geneService.setCurrentTissue(undefined);
        }

        this.oldIndex = this.index;
        if (event.value.length > LIMIT_NUMBER) { event.value.splice(0, 1); }
    }

    registerBoxPlot(label: string, constraints: any[], yAxisLabel: string, attr: string) {
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
            }
        );
    }

    async createComponent(index: number, info1: any, label1: string) {
        const eArray = this.entries.toArray();
        if (this.componentRefs[index]) { eArray[index].clear(); }
        this.componentRefs[index] = await new Promise((resolve) => {
                setTimeout(() => {
                    const factory = this.resolver.resolveComponentFactory(BoxPlotsViewComponent);
                    resolve(eArray[index].createComponent(factory));
                }, 100);
            }) as ComponentRef<BoxPlotsViewComponent>;
        this.componentRefs[index].instance.tissue = this.tissues[index].value;
        this.componentRefs[index].instance.model = this.geneService.getCurrentModel();
        this.componentRefs[index].instance.label1 = label1;
        this.componentRefs[index].instance.info1 = info1;
    }

    destroyComponent(index: number) {
        this.componentRefs[index].destroy();
    }

    openDropdown() {
        this.dropdownIconClass = 'fa fa-caret-up';
    }

    closeDropdown() {
        this.dropdownIconClass = 'fa fa-caret-down';
    }

    getDropdownIcon(): string {
        return this.dropdownIconClass;
    }

    showDialog(dialogString: string) {
        this[dialogString] = true;
    }
}
