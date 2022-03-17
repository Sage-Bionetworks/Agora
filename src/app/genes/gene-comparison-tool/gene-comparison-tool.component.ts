import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Table } from 'primeng/table';
import { FilterService } from 'primeng/api';

import { ApiService } from '../../core/services';
import { GeneInfosResponse, GenesResponse } from '../../models';

import { GeneComparisonToolFilter } from '.';

import {
   GeneComparisonToolFilterPanelComponent,
   GeneComparisonToolDetailsPanelComponent
} from './';

@Component({
   selector: 'gene-comparison-tool',
   templateUrl: './gene-comparison-tool.component.html',
   styleUrls: [ './gene-comparison-tool.component.scss' ],
   encapsulation: ViewEncapsulation.None
})
export class GeneComparisonToolComponent implements OnInit  {
   pinnedGenes: any[] = [];
   availableGenes: any[] = [];
   geneInfos: Map<string, object> = null;
   loading: boolean = true;
   urlParams: any = null;

   sortOrder: number = -1;
   sortField: string = 'CBE';

   searchTerm: string = '';

   analyses: any[] = [
      {name: 'RNA - Differential Expression'},
      {name: 'RNA - Overall Expression'}
   ];
   defaultAnalysis: any = {name: 'RNA - Differential Expression'};
   selectedAnalysis: any = {name: 'RNA - Differential Expression'};

   models: any[] = [
      {name: 'AD Diagnosis (males and females)'},
      {name: 'AD Diagnosis x AOD (males and females)'},
      {name: 'AD Diagnosis x Sex (females only)'},
      {name: 'AD Diagnosis x Sex (males only)'}
   ];
   defaultModel: any = {name: 'AD Diagnosis (males and females)'};
   selectedModel: any = {name: 'AD Diagnosis (males and females)'};

   tissues: any[] = [
      {name: 'CBE'},
      {name: 'DLPFC'},
      {name: 'FP'},
      {name: 'IFG'},
      {name: 'PHG'},
      {name: 'STG'},
      {name: 'TCX'}
   ];

   filters: GeneComparisonToolFilter[] = [
      {
         name: 'nominations',
         label: 'Number of Nominations',
         short: 'Nominations',
         matchMode: 'in',
         options: [],
      },
      {
         name: 'teams',
         label: 'Nominating Teams',
         short: 'Team',
         matchMode: 'customIn',
         options: [],
      },
      {
         name: 'year_first_nominated',
         label: 'Year First Nominated',
         short: 'Year',
         matchMode: 'in',
         options: [],
      },
      {
         name: 'studies',
         label: 'Cohort Study',
         short: 'Study',
         matchMode: 'customIn',
         options: [],
      },
      {
         name: 'input_datas',
         label: 'Input Data',
         short: 'Data',
         matchMode: 'customIn',
         options: [],
      }
   ];

   minLogfc: number = null;
   maxLogfc: number = null;

   minMedianLogcpm: number = null;
   maxMedianLogcpm: number = null;

   @ViewChild('tableHeader', { static: false }) tableHeader: Table;
   @ViewChild('pinnedGeneTable', { static: false }) pinnedGeneTable: Table;
   @ViewChild('availableGeneTable', { static: false }) availableGeneTable: Table;

   @ViewChild('filterPanel', { static: false }) filterPanel: GeneComparisonToolFilterPanelComponent;
   @ViewChild('detailsPanel', { static: false }) detailsPanel: GeneComparisonToolDetailsPanelComponent;

   constructor(
      private router: Router,
      private route: ActivatedRoute,
      private apiService: ApiService,
      private filterService: FilterService
   ) { }

   ngOnInit() {
      this.route.queryParams.subscribe(params => {
         this.urlParams = params;
         this.loadGenes();
         this.loadGeneInfos();

         if (this.urlParams.hasOwnProperty('analysis') && this.urlParams['analysis']) {
            this.selectedAnalysis = { name: this.urlParams['analysis'] }
         }

         if (this.urlParams.hasOwnProperty('model') && this.urlParams['model']) {
            this.selectedModel = { name: this.urlParams['model'] }
         }
      });

      this.filterService.register('customIn', (value, filter): boolean => {
            if (filter === undefined || filter === null || filter.length < 1) {
                return true;
            } else if (value === undefined || value === null || filter.length < 1) {;
                return false;
            };

            for (const _filter of filter) {
               if (value.indexOf(_filter) !== -1) {
                  return true;
               }
            }

            return false;
      });
   }

   /* ----------------------------------------------------------------------- */
   /* Genes
   /* ----------------------------------------------------------------------- */

   loadGenes() {
      this.loading = true;
      this.apiService.getComparisonData({
         analysis: this.selectedAnalysis.name,
         model: this.selectedModel.name
      }).subscribe((data: GenesResponse) => {
         this.availableGenes = data.items;
         if (this.geneInfos) {
            this.initGenes();
            this.loading = false;
         }
      });
   }

   loadGeneInfos() {
      if (this.geneInfos) return;
      this.loading = true;
      this.apiService.getInfos().subscribe((data: GeneInfosResponse) => {
         this.geneInfos = new Map(data.items.map(info => [info.ensembl_gene_id, info]));
         if (this.availableGenes.length > 0) {
            this.initGenes();
            this.loading = false;
         }
      });
   }

   initGenes() {
      this.minLogfc = null;
      this.maxLogfc = null;
      this.minMedianLogcpm = null;
      this.maxMedianLogcpm = null;

      for (const gene of this.availableGenes) {
         const info: any = this.geneInfos.get(gene.ensembl_gene_id);

         if (info) {
            if (info.hgnc_symbol) {
               gene.hgnc_symbol = info.hgnc_symbol;
            }

            gene.search_string = gene.hgnc_symbol + ' ' + gene.ensembl_gene_id;

            gene.nominations = info.nominations || 0;
            this.setFilterOption('nominations', gene.nominations);

            gene.teams = [];
            gene.studies = [];
            gene.input_datas = [];
            gene.year_first_nominated = null;

            if (info.nominatedtarget && info.nominatedtarget.length > 0) {
               for (const nominated of info.nominatedtarget) {

                  if (nominated.team) {
                     gene.teams.push(nominated.team);
                     this.setFilterOption('teams', nominated.team);
                  }

                  if (nominated.study) {
                     nominated.study.split(', ').forEach(study => {
                        gene.studies.push(study);
                        this.setFilterOption('studies', study);
                     });
                  }

                  if (nominated.input_data) {
                     nominated.input_data.split(', ').forEach(inputData => {
                        gene.input_datas.push(inputData);
                        this.setFilterOption('input_datas', inputData);
                     });
                  }

                  if (nominated.initial_nomination) {
                     if (!gene.year_first_nominated || nominated.initial_nomination < gene.year_first_nominated) {
                        gene.year_first_nominated = nominated.initial_nomination;
                     }
                     this.setFilterOption('year_first_nominated', gene.year_first_nominated);
                  }
               }
            }

            if (info.medianexpression) {
               const medianLogcpms = info.medianexpression.map(exp => exp.medianlogcpm);
               gene.minMedianLogcpm = Math.min.apply(Math, medianLogcpms);
               gene.maxMedianLogcpm = Math.max.apply(Math, medianLogcpms);
               gene.hasMedianLogcpm = true;
               this.minMedianLogcpm = (null === this.minMedianLogcpm || gene.minMedianLogcpm < this.minMedianLogcpm) ? gene.minMedianLogcpm : this.minMedianLogcpm;
               this.maxMedianLogcpm = (null === this.maxMedianLogcpm || gene.minMedianLogcpm > this.maxMedianLogcpm) ? gene.minMedianLogcpm : this.maxMedianLogcpm;

               for (const medianExpression of info.medianexpression) {
                  const tissue = gene.tissues.find(t => t.name === medianExpression.tissue);
                  if (tissue) {
                     tissue.medianlogcpm = medianExpression.medianlogcpm;
                  }
               }
            }
         }

         gene.tissues.forEach(tissue => {
            this.minLogfc = (null === this.minLogfc || tissue.logfc < this.minLogfc) ? tissue.logfc : this.minLogfc;
            this.maxLogfc = (null === this.maxLogfc || tissue.logfc > this.maxLogfc) ? tissue.logfc : this.maxLogfc;
         });
      }

      this.getUrlParam('pinned', true).forEach(pinned => {
         this.pinGene(this.availableGenes.find(gene => gene.ensembl_gene_id === pinned), false);
      });

      this.sortField = this.getUrlParam('sortField') || 'CBE';
      this.sortOrder = this.getUrlParam('sortOrder') ? parseInt(this.getUrlParam('sortOrder')) : -1;
      this.sortTable(this.tableHeader);

      this.filter();
   }

   /* ----------------------------------------------------------------------- */
   /* Filters
   /* ----------------------------------------------------------------------- */

   setFilters(filters) {
      this.filters = filters;
      this.updateUrl();
      this.filter();
   }

   getFilterValues() {
      const values = {};

      for (const filter of this.filters) {
         const value = [];
         for (const option of filter.options.filter(o => o.selected)) {
            value.push(option.value);
         }
         if (value.length) {
            values[filter.name] = value;
         }
      }

      return values;
   }

   setFilterOption(name, value) {
      const filter = value ? this.filters.find(f => f.name === name) : null;
      if (filter && !filter.options.find(option => value === option.value)) {
         const urlParams = this.getUrlParam(filter.name, true);
         filter.options.push({
            'label': value,
            'value': value,
            'selected': urlParams && urlParams.indexOf(typeof value === 'string' ? value : String(value)) !== -1 ? true : false
         });
         filter.options.sort((a, b) => {
            if (a.label < b.label) {
               return -1;
            } else if (a.label > b.label) {
               return 1;
            }
            return 0;
         });
         if (typeof value === 'number') {
            filter.options.reverse();
         }
      }
   }

   hasSelectedFilters() {
      for (const filter of this.filters) {
         if (filter.options.filter(option => option.selected).length > 0) {
            return true;
         }
      }
      return false;
   }

   setSearchTerm(term) {
      this.searchTerm = term;
      this.filter();
   }

   clearSearch() {
      this.searchTerm = '';
      this.filter();
   }

   filter() {
      const delay = this.availableGeneTable.filterDelay;
      this.availableGeneTable.filterDelay = 0;

      this.availableGeneTable.filter(this.searchTerm, 'search_string', 'contains');

      if ('RNA - Overall Expression' === this.selectedAnalysis.name) {
         this.availableGeneTable.filter(true, 'hasMedianLogcpm', 'equals');
      }

      this.filters.forEach(filter => {
         const values = filter.options.filter(option => option.selected).map(selected => selected.value);
         this.availableGeneTable.filter(values, filter.name, filter.matchMode || 'equals');
      });

      this.availableGeneTable.filterDelay = delay;
   }

   /* ----------------------------------------------------------------------- */
   /* Sort
   /* ----------------------------------------------------------------------- */

   sortCallback(event: any) {
      event.data.sort((a, b) => {
         let result = null;
         if ('hgnc_symbol' === event.field) {
            const stringA = a.hgnc_symbol || a.ensembl_gene_id;
            const stringB = b.hgnc_symbol || b.ensembl_gene_id;
            result = stringA.localeCompare(stringB);
         } else {
            const tissueA = a.tissues.find(tissue => tissue.name === event.field)
            const tissueB = b.tissues.find(tissue => tissue.name === event.field)

            if (tissueA && tissueB) {
               if (tissueA.logfc == null && tissueB.logfc != null)
                  result = -1;
               else if (tissueA.logfc != null && tissueB.logfc == null)
                  result = 1 === event.order ? -1 : 1;
               else if (tissueA.logfc == null && tissueB.logfc == null)
                  result = 0;
               else
                  result = (tissueA.logfc < tissueB.logfc) ? -1 : (tissueA.logfc > tissueB.logfc) ? 1 : 0;
            } else {
               if (!tissueA && tissueB)
                  result = -1;
               else if (tissueA && !tissueB)
                  result = 1 === event.order ? -1 : 1;
               else
                  result = 0;
            }
         }

         return (event.order * result);
      });
   }

   sortTable(table) {
      table.sortField = null;
      table.defaultSortOrder = this.sortOrder;
      table.sort({ field: this.sortField });
   }

   sort() {
      this.sortTable(this.pinnedGeneTable);
      this.sortTable(this.availableGeneTable);

      // this.pinnedGeneTable.sortField = null;
      // this.pinnedGeneTable.defaultSortOrder = this.sortOrder;
      // this.pinnedGeneTable.sort({
      //    data: this.pinnedGenes,
      //    field: this.sortField,
      //    order: this.sortOrder
      // });

      // this.availableGeneTable.sortField = null;
      // this.availableGeneTable.defaultSortOrder = this.sortOrder;
      // this.availableGeneTable.sort({
      //    data: this.availableGenes,
      //    field: this.sortField,
      //    order: this.sortOrder
      // });
   }

   updateSortOptions(event) {
      this.sortField = event.field;
      this.sortOrder = event.order;
      this.sort();
      this.updateUrl();
   }

   /* ----------------------------------------------------------------------- */
   /* Pin/Unpin
   /* ----------------------------------------------------------------------- */

   pinGene(gene, refresh: boolean = true) {
      if (this.pinnedGenes.findIndex(pinnedGene => pinnedGene.ensembl_gene_id === gene.ensembl_gene_id) === -1) {
         const availableGeneIndex = this.availableGenes.findIndex(availableGene => availableGene.ensembl_gene_id === gene.ensembl_gene_id);
         this.pinnedGenes.push(gene);
         if (availableGeneIndex !== -1) {
            this.availableGenes.splice(availableGeneIndex, 1);
         }
         if (refresh) {
            this.sort();
            this.filter();
            this.updateUrl();
         }
      }
   }

   unpinGene(gene, refresh: boolean = true) {
      const pinnedGeneIndex = this.pinnedGenes.findIndex(pinnedGene => pinnedGene.ensembl_gene_id === gene.ensembl_gene_id);
      if (pinnedGeneIndex !== -1) {
         if (this.availableGenes.findIndex(availableGene => availableGene.ensembl_gene_id === gene.ensembl_gene_id) === -1) {
            this.availableGenes.push(gene);
         }
         this.pinnedGenes.splice(pinnedGeneIndex, 1);
         if (refresh) {
            this.sort();
            this.filter();
            this.updateUrl();
         }
      }
   }

   clearPinned() {
      this.pinnedGenes.forEach(gene => {
         if (this.availableGenes.findIndex(availableGene => availableGene.ensembl_gene_id === gene.ensembl_gene_id) === -1) {
            this.availableGenes.push(gene);
         }
      });

      this.pinnedGenes = [];
      this.sort();
      this.filter();
      this.updateUrl();
   }

   /* ----------------------------------------------------------------------- */
   /*
   /* ----------------------------------------------------------------------- */

   getUrlParam(name, returnArray = false) {
      if (this.urlParams && this.urlParams.hasOwnProperty(name)) {
         return returnArray && typeof this.urlParams[name] === 'string' ? this.urlParams[name].split(',') : this.urlParams[name];
      }
      return returnArray ? [] : null;
   }

   updateUrl() {
      let url = this.router.serializeUrl(
         this.router.createUrlTree([
            '/genes',
            {
               outlets: {
                  'genes-router': [
                     'gene-comparison-tool'
                  ]
               }
            }
         ])
      );

      const pinned = this.pinnedGenes.map(gene => gene.ensembl_gene_id);
      const params: any = this.getFilterValues();

      if (pinned.length > 0) {
         params['pinned'] = pinned;
      }

      if (this.selectedAnalysis.name !== this.defaultAnalysis.name) {
         params['analysis'] = this.selectedAnalysis.name;
      }

      if (this.selectedModel.name !== this.defaultModel.name) {
         params['model'] = this.selectedModel.name;
      }

      if (this.sortField && this.sortField !== 'hgnc_symbol') {
         params['sortField'] = this.sortField;
         params['sortOrder'] = this.sortOrder;
      }

      if (Object.keys(params).length > 0) {
         url += '?' + new URLSearchParams(params);
      }

      window.history.pushState(null, '', url);
   }

   /* ----------------------------------------------------------------------- */
   /*
   /* ----------------------------------------------------------------------- */

   getDetailsPanelData(tissueName, gene) {
      const tissue = gene.tissues.find(t => t.name === tissueName);
      if (tissue) {
         if ('RNA - Overall Expression' === this.selectedAnalysis.name) {
            return {
               label: (gene.hgnc_symbol ? gene.hgnc_symbol + ' - ' : '') + gene.ensembl_gene_id,
               heading: 'Overall RNA Expression (' + tissue.name + ')',
               valueLabel: 'Log CPM',
               value: parseFloat(tissue.medianlogcpm?.toPrecision(3)),
               min: parseFloat(gene.minMedianLogcpm?.toPrecision(3)),
               max: parseFloat(gene.maxMedianLogcpm?.toPrecision(3)),
               footer: 'Meaningful Expression is considered to be a Log CPM value > 0.7'
            }
         } else {
            return {
               label: (gene.hgnc_symbol ? gene.hgnc_symbol + ' - ' : '') + gene.ensembl_gene_id,
               heading: 'Differential RNA Expression (' + tissue.name + ')',
               subHeading: this.selectedModel.name,
               valueLabel: 'Log 2 Fold Change',
               value: tissue.logfc,
               pValue: tissue.adj_p_val,
               min: parseFloat(tissue.ci_l.toPrecision(2)),
               max: parseFloat(tissue.ci_r.toPrecision(2)),
               footer: 'Significance is considered to be an adjusted p-value < 0.05'
            }
         }
      }
   }

   /* ----------------------------------------------------------------------- */
   /*
   /* ----------------------------------------------------------------------- */

   nRoot(x, n) {
      try {
         const negate = n % 2 === 1 && x < 0;
         if (negate)
            x = -x;
         const possible = Math.pow(x, 1 / n);
         n = Math.pow(possible, n);
         if (Math.abs(x - n) < 1 && (x > 0 === n > 0))
            return negate ? -possible : possible;
      } catch(e){
         return;
      }
   }

   getCircleStyle(tissueName, gene) {
      let size = 0;
      let bgRGB = [236, 236, 236];
      let bgAlpha = 0.4;
      let borderColor = '#C2C2C2';

      const tissue = gene.tissues.find(t => t.name === tissueName);

      if (tissue) {
         if (tissue.adj_p_val) {
            const pValue = 1 - this.nRoot(tissue.adj_p_val, 3);
            size = Math.round((100 * pValue) * 0.44);
            size = size < 6 ? 6 : size;
         }

         if (tissue.logfc) {
            if (tissue.logfc >= 0) {
               bgRGB = [139, 233, 210];
               borderColor = '#069C81';
               bgAlpha = 0.4 + (0.4 * (tissue.logfc / this.maxLogfc));
            } else {
               bgRGB = [201, 175, 255];
               borderColor = '#A684EE';
               bgAlpha = 0.4 + (0.4 * (Math.abs(tissue.logfc) / Math.abs(this.maxLogfc)));
            }
         }
      }

      return {
         display: size ? 'block' : 'none',
         width: size + 'px',
         height: size + 'px',
         backgroundColor: 'rgba(' + bgRGB[0] + ',' + bgRGB[1] + ',' + bgRGB[2] + ',' + bgAlpha + ')',
         borderColor: borderColor
      };
   }

   /* ----------------------------------------------------------------------- */
   /*
   /* ----------------------------------------------------------------------- */

   navigateToGene(gene) {
      const url = this.router.serializeUrl(
         this.router.createUrlTree([
            '/genes',
            {
               outlets: {
                  'genes-router': [
                     'gene-details',
                     gene.ensembl_gene_id
                  ]
               }
            }
         ])
      );

      window.open(url, '_blank');
   }

   copyUrl() {
      navigator.clipboard.writeText(window.location.href);
   }

   onQueryChange() {
      this.updateUrl();
      this.loadGenes();
   }
}
