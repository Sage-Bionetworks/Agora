import {
    Component,
    OnInit,
    ViewEncapsulation,
    Input,
    ElementRef,
    ViewChild,
    OnDestroy
} from '@angular/core';

import { ActivatedRoute, Router, NavigationStart } from '@angular/router';

import { PlatformLocation } from '@angular/common';

import { ChartService } from '../../services';
import { GeneService, DataService, ApiService } from '../../../core/services';

import { GeneResponse } from '../../../models';

import * as d3 from 'd3';
import * as dc from 'dc';

@Component({
    selector: 'select-menu',
    templateUrl: './select-menu-view.component.html',
    styleUrls: [ './select-menu-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class SelectMenuViewComponent implements OnInit, OnDestroy {
    @Input() label: string = 'select-model';
    @Input() columnName: string = '';
    @Input() chart: any;
    @Input() info: any;
    @Input() promptText: string;
    @Input() filterStrings: string[] = [];
    @Input() defaultValue: string;
    @Input() currentGene = this.geneService.getCurrentGene();
    @Input() tissues = this.geneService.getGeneTissues();
    @Input() models = this.geneService.getGeneModels();
    @Input() dim: any;
    @Input() group: any;

    @ViewChild('sm') selectMenu: ElementRef;

    isDisabled: boolean = true;
    destroyed: boolean = false;
    firstTime: boolean = true;
    menuSelection: any;

    constructor(
        private location: PlatformLocation,
        private router: Router,
        private route: ActivatedRoute,
        private dataService: DataService,
        private geneService: GeneService,
        private apiService: ApiService,
        private chartService: ChartService
    ) { }

    ngOnInit() {
        // If we move away from the overview page, remove
        // the charts
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                d3.selectAll('.select-selected, .select-items.select-hide').html(null);
                this.removeChart();
            }
        });
        this.location.onPopState(() => {
            d3.selectAll('.select-selected, .select-items.select-hide').html(null);
            this.removeChart();
        });

        if (!this.label) {
            this.route.params.subscribe((params) => {
                this.label = params['label'];
                this.initChart();
            });
        } else {
            this.initChart();
        }

        this.chartService.chartsReady$.subscribe((state: boolean) => {
            if (state) {
                this.replaceSelect();
            }
        });
    }

    initChart() {
        const self = this;
        this.info = this.chartService.getChartInfo(this.label);
        this.dim = this.dataService.getDimension(this.info);

        this.getChartPromise().then((chartInst) => {
            self.chart = chartInst;

            chartInst.filterHandler((dimension, filters) => {
                if (filters.length === 0) {
                    // The empty case (no filtering)
                    dimension.filter(null);
                } else if (filters.length === 1 && !filters[0].isFiltered) {
                    // Single value and not a function-based filter
                    // Before filters are applied, update the gene
                    if (self.label === 'select-tissue') {
                        self.geneService.setCurrentTissue(filters[0]);

                        if (self.firstTime) {
                            self.firstTime = false;
                        } else {
                            self.getNewGenes();
                        }
                    }
                    if (self.label === 'select-model') {
                        self.geneService.setCurrentModel(filters[0]);
                    }

                    if (self.geneService.getCurrentModel() && self.geneService.getCurrentTissue()) {
                        self.geneService.setCurrentGene(self.dataService.getGeneEntries()
                            .slice().find((g) => {
                                return g.model === self.geneService.getCurrentModel() &&
                                    g.tissue === self.geneService.getCurrentTissue();
                            })
                        );
                    }

                    dimension.filterExact(filters[0]);
                } else if (filters.length === 1 && filters[0].filterType === 'RangedFilter') {
                    // Single range-based filter
                    dimension.filterRange(filters[0]);
                } else {
                    // An array of values, or an array of filter objects
                    dimension.filterFunction((d) => {
                        filters.forEach((filter) => {
                            if (filter.isFiltered && filter.isFiltered(d)) {
                                return true;
                            } else if (filter <= d && filter >= d) {
                                return true;
                            }
                        });
                        return false;
                    });
                }
                return filters;
            });
            chartInst.promptText(this.promptText);

            chartInst.on('postRender', () => {
                // Registers this chart
                self.chartService.addChartName(self.label);
            });

            chartInst.render();
        });
    }

    multivalueFilter(values) {
        return (v) => {
            return values.indexOf(v) !== -1;
        };
    }

    getNewGenes() {
        let gene = null;
        this.apiService.getGene(
            this.geneService.getCurrentGene().ensembl_gene_id,
            this.geneService.getCurrentTissue(),
            this.geneService.getCurrentModel()
        ).subscribe((data: GeneResponse) => {
                if (!data.info) {
                    this.router.navigate(['/genes']);
                } else {
                    if (!data.item) {
                        // Fill in a new gene with the info attributes
                        data.item = this.geneService.getEmptyGene(
                            data.info.ensembl_gene_id, data.info.hgnc_symbol
                        );
                    }
                }

                this.geneService.updateGeneData(data);
                gene = data.item;
            }, (error) => {
                console.log('Error getting gene: ' + error.message);
            }, () => {
                // Check if we have a database id at this point
                if (gene && gene._id) {
                    this.geneService.setCurrentTissue(gene.tissue);
                    this.geneService.setCurrentModel(gene.model);
                }
            }
        );
    }

    removeChart() {
        if (this.chart) {
            this.chartService.removeChart(
                this.chart, this.chart.group(),
                this.chart.dimension()
            );
            this.chartService.removeChartName(this.label);
            this.chart = null;
            this.geneService.setPreviousGene(this.geneService.getCurrentGene());
        }
    }

    replaceSelect() {
        if (this.defaultValue) {
            this.generateSelect();
            this.removeFirstOption();
        }
    }

    removeFirstOption() {
        this.menuSelection = d3.select(this.selectMenu.nativeElement)
            .select('select.dc-select-menu');
        const oldOptions = this.menuSelection.selectAll('option');
        const firstOldOption = oldOptions.filter((d, i) => i === 0);
        // If the first option is the text All, we need to remove it
        // because it is not a brain tissue. This is the default text
        // in the selectMenu chart
        let newOptions = null;
        if (firstOldOption['_groups'][0][0].innerHTML === 'All') {
            firstOldOption.remove();
            newOptions = oldOptions.filter((d, i) => i !== 0);
        } else {
            newOptions = oldOptions;
        }

        for (const no of newOptions['_groups'][0]) {
            if (this.label === 'select-tissue') {
                if (no.innerHTML === this.geneService.getDefaultTissue()) {
                    this.chart.replaceFilter([[no.innerHTML]]).redrawGroup();
                    break;
                }
            }
            if (this.label === 'select-model') {
                if (no.innerHTML === this.geneService.getDefaultModel()) {
                    this.chart.replaceFilter([[no.innerHTML]]).redrawGroup();
                    break;
                }
            }
        }

        this.defaultValue = '';
    }

    getChartPromise(): Promise<dc.SelectMenu> {
        const self = this;
        return new Promise((resolve, reject) => {
            const chartInst = dc.selectMenu(this.selectMenu.nativeElement)
                .dimension(this.dim)
                .group(this.dim.group())
                .controlsUseVisibility(true)
                .title((d) => {
                    return d.key;
                })
                .on('filtered', (chart, filter) => {
                    if (self.label === 'select-tissue') {
                        if (filter instanceof Array) {
                            self.geneService.setCurrentTissue(filter[0][0]);
                        } else {
                            self.geneService.setCurrentTissue(filter);
                        }
                    }
                    if (self.label === 'select-model') {
                        if (filter instanceof Array) {
                            self.geneService.setCurrentModel(filter[0][0]);
                        } else {
                            self.geneService.setCurrentModel(filter);
                        }
                    }
                    self.isDisabled = (filter) ? false : true;
                });

            resolve(chartInst);
        });
    }

    filterAll() {
        this.chart.filterAll((this.filterStrings.length) ? this.filterStrings : null);
        dc.redrawAll();
        this.isDisabled = true;
    }

    generateSelect() {
        const self = this;
        // Look for any elements with the class 'dc-select-menu'
        const oriSelEl: HTMLSelectElement =
            document.getElementsByClassName('dc-select-menu')[0] as HTMLSelectElement;

        const a = document.createElement('DIV');
        a.setAttribute('class', 'select-selected');

        a.innerHTML = oriSelEl.options[1].innerHTML;
        const newSelElmnt = document.getElementsByClassName(this.columnName)[0];
        newSelElmnt.appendChild(a);

        // For each element, create a new DIV that will contain the option list
        const b = document.createElement('DIV');
        b.setAttribute('class', 'select-items select-hide');
        for (let j = 1; j < oriSelEl.options.length; j++) {
            // For each option in the original select element,
            // create a new DIV that will act as an option item
            const c: HTMLDivElement = document.createElement('DIV') as HTMLDivElement;
            c.innerHTML = oriSelEl.options[j].innerHTML;
            c['index'] = j - 1;
            if (j === 1) { c.setAttribute('class', 'same-as-selected'); }

            c.addEventListener('click', function(e) {
                self.menuSelection = d3.select(self.selectMenu.nativeElement)
                    .select('select.dc-select-menu');
                const options = self.menuSelection.selectAll('option');
                options['_groups'][0][e.target['index']]['selected'] = 'selected';
                self.menuSelection.dispatch('change');

                // When an item is clicked, update the original select box,
                // and the selected item
                const s = this.parentNode.parentNode
                    .parentNode['getElementsByTagName']('select')[0];
                const h = this.parentNode.previousSibling;
                for (let i = 0; i < s.length; i++) {
                    if (s.options[i].innerHTML === this.innerHTML) {
                        s.selectedIndex = i;
                        h['innerHTML'] = this.innerHTML;
                        const y = this.parentNode['getElementsByClassName']('same-as-selected');
                        y[0].removeAttribute('class');
                        this.setAttribute('class', 'same-as-selected');
                        break;
                    }
                }
                h['click']();
            });
            b.appendChild(c);
        }

        newSelElmnt.appendChild(b);
        a.addEventListener('click', function(e) {
            // When the select box is clicked, close any other select boxes,
            // and open/close the current select box
            e.stopPropagation();
            self.closeAllSelect(this);
            this.nextSibling['classList'].toggle('select-hide');
            this.classList.toggle('select-arrow-active');
        });

        // If the user clicks anywhere outside the select box,
        // then close all select boxes
        document.addEventListener('click', this.closeAllSelect);
    }

    closeAllSelect(elmnt) {
        // A function that will close all select boxes in the document,
        // except the current select box
        const arrNo = [];
        const x = document.getElementsByClassName('select-items');
        const y = document.getElementsByClassName('select-selected');
        for (let i = 0; i < y.length; i++) {
            if (elmnt === y[i]) {
                arrNo.push(i);
            } else {
                y[i].classList.remove('select-arrow-active');
            }
        }
        for (let i = 0; i < x.length; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add('select-hide');
            }
        }
    }

    ngOnDestroy() {
        this.chartService.removeChart(this.chart);
    }
}
