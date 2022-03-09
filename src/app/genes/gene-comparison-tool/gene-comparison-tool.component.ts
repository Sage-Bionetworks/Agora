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



   sortOrder: number = 1;
   sortField: string = 'hgnc_symbol';

   searchTerm: string = '';

   categories: any[] = [
      {name: 'RNA - Differential Expression'},
      {name: 'RNA - Overall Expression', disabled: true},
      {name: 'Proteomics', disabled: true},
      {name: 'Metabolomics', disabled: true}
   ];
   defaultCategory: any = {name: 'RNA - Differential Expression'};
   selectedCategory: any = {name: 'RNA - Differential Expression'};

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

   minLogfc: number = 0;
   maxLogfc: number = 0;

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

         if (this.urlParams.hasOwnProperty('category') && this.urlParams['category']) {
            this.selectedCategory = { name: this.urlParams['category'] }
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

            for (let i = 0; i < filter.length; i++) {
               if (value.indexOf(filter[i]) !== -1) {
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
         category: this.selectedCategory.name,
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
      for (let gene of this.availableGenes) {
         const info: any = this.geneInfos.get(gene.ensembl_gene_id);
         if (info) {

            if (info.hgnc_symbol) {
               gene.hgnc_symbol = info.hgnc_symbol;
            }

            gene.nominations = info.nominations || 0;
            this.setFilterOption('nominations', gene.nominations);

            gene.teams = [];
            gene.studies = [];
            gene.input_datas = [];
            gene.year_first_nominated = null;

            if (info.nominatedtarget && info.nominatedtarget.length > 0) {
               for (let nominated of info.nominatedtarget) {

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
                     nominated.input_data.split(', ').forEach(input_data => {
                        gene.input_datas.push(input_data);
                        this.setFilterOption('input_datas', input_data);
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

            gene.tissues.forEach(tissue => {
               if (tissue.logfc < 0) {
                  if (tissue.logfc < this.minLogfc) {
                     this.minLogfc = tissue.logfc;
                  }
               } else {
                  if (tissue.logfc > this.maxLogfc) {
                     this.maxLogfc = tissue.logfc;
                  }
               }
            });
         }
      }

      this.getUrlParam('pinned').forEach(pinned => {
         this.pinGene(this.availableGenes.find(gene => gene.ensembl_gene_id === pinned), false);
      });

      const sort = this.getUrlParam('sort');
      if (sort) {
         this.tableHeader.sortMode = 'single';
         this.tableHeader.defaultSortOrder = parseInt(sort[1]);
         this.tableHeader.sort({ field: sort[0] });
      }

      this.sort();
      this.filter();
   }

   /* ----------------------------------------------------------------------- */
   /* Filters
   /* ----------------------------------------------------------------------- */

   setFilters(filters) {
      console.log('setFilters', filters);
      this.filters = filters;
      this.updateUrl();
      this.filter();
   }

   getFilterValues() {
      let values = {};

      for (let filter of this.filters) {
         let value = [];
         for (let option of filter.options.filter(o => o.selected)) {
            value.push(option.value);
         }
         if (value.length) {
            values[filter.name] = value;
         }
      }

      return values;
   }

   setFilterOption(name, value) {
      let filter = value ? this.filters.find(filter => filter.name === name) : null;
      if (filter && !filter.options.find(option => value === option.value)) {
         const urlParams = this.getUrlParam(filter.name);
         filter.options.push({
            label: value,
            value: value,
            selected: urlParams && urlParams.indexOf(value) != -1 ? true : false
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
      for (let filter of this.filters) {
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

   filter() {
      const delay = this.availableGeneTable.filterDelay;
      this.availableGeneTable.filterDelay = 0;

      this.availableGeneTable.filterGlobal(this.searchTerm, 'contains');

      this.filters.forEach(filter => {
         const values = filter.options.filter(option => option.selected).map(selected => selected.value);
         this.availableGeneTable.filter(values, filter.name, filter.matchMode || 'equals');
      });

      this.availableGeneTable.filterDelay = delay;
   }

   /* ----------------------------------------------------------------------- */
   /* Sort
   /* ----------------------------------------------------------------------- */

   sortGenes(genes) {
      genes.sort((a, b) => {
         let result = null;
         if ('hgnc_symbol' === this.sortField) {
            const stringA = a.hgnc_symbol || a.ensembl_gene_id;
            const stringB = b.hgnc_symbol || b.ensembl_gene_id;
            result = stringA.localeCompare(stringB);
         } else {
            const tissueA = a.tissues.find(tissue => tissue.name === this.sortField)
            const tissueB = b.tissues.find(tissue => tissue.name === this.sortField)

            if (tissueA && tissueB) {
               if (tissueA.logfc == null && tissueB.logfc != null)
                  result = -1;
               else if (tissueA.logfc != null && tissueB.logfc == null)
                  result = 1 === this.sortOrder ? -1 : 1;
               else if (tissueA.logfc == null && tissueB.logfc == null)
                  result = 0;
               else
                  result = (tissueA.logfc < tissueB.logfc) ? -1 : (tissueA.logfc > tissueB.logfc) ? 1 : 0;
            } else {
               if (!tissueA && tissueB)
                  result = -1;
               else if (tissueA && !tissueB)
                  result = 1 === this.sortOrder ? -1 : 1;
               else
                  result = 0;
            }
         }

         return (this.sortOrder * result);
      });
   }

   sort() {
      this.sortGenes(this.pinnedGenes);
      this.sortGenes(this.availableGenes);
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

   getUrlParam(name) {
      if (this.urlParams && this.urlParams.hasOwnProperty(name)) {
         return typeof this.urlParams[name] === 'string' ? this.urlParams[name].split(',') : this.urlParams[name];
      }
      return [];
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
      let params: any = this.getFilterValues();

      if (pinned.length > 0) {
         params['pinned'] = pinned;
      }

      if (this.selectedCategory.name !== this.defaultCategory.name) {
         params['category'] = this.selectedCategory.name
      }

      if (this.selectedModel.name !== this.defaultModel.name) {
         params['model'] = this.selectedModel.name
      }

      if (this.sortField && this.sortField !== 'hgnc_symbol') {
         params['sort'] = [this.sortField, this.sortOrder]
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
      const tissue = gene.tissues.find(tissue => tissue.name === tissueName);
      return {
         category: this.selectedCategory.name,
         model: this.selectedModel.name,
         hgnc_symbol: gene.hgnc_symbol,
         ensembl_gene_id: gene.ensembl_gene_id,
         tissue: tissue.name,
         logfc: tissue.logfc,
         adj_p_val: tissue.adj_p_val,
         ci_l: tissue.ci_l,
         ci_r: tissue.ci_r
      }
   }

   /* ----------------------------------------------------------------------- */
   /*
   /* ----------------------------------------------------------------------- */

   nthroot(x, n) {
      try {
        var negate = n % 2 == 1 && x < 0;
        if(negate)
          x = -x;
        var possible = Math.pow(x, 1 / n);
        n = Math.pow(possible, n);
        if(Math.abs(x - n) < 1 && (x > 0 == n > 0))
          return negate ? -possible : possible;
      } catch(e){}
    }

   getCircleStyle(tissueName, gene) {
      let size = 0;
      let opacity = 0;
      let bgColor = 'rgba(139, 233, 210, 0.65)';
      let borderColor = '#069C81';

      const tissue = gene.tissues.find(tissue => tissue.name === tissueName);

      if (tissue) {
         size = (100 * (1 - this.nthroot(tissue.adj_p_val, 3))) * 0.44;
         opacity = (((tissue.logfc - this.minLogfc) * 100) / (this.maxLogfc - tissue.logfc)) / 100;

         if (tissue.logfc < 0) {
            bgColor = 'rgba(201, 175, 255, 0.4)';
            borderColor = '#A684EE';
         }

         opacity = opacity < 0.1 ? 0.1 : opacity;
         size = size < 6 ? 6 : size;
      }

      return {
         width: Math.round(size) + 'px',
         height: Math.round(size) + 'px',
         opacity: opacity,
         backgroundColor: bgColor,
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
      console.log('copyUrl', window.location.href);
      navigator.clipboard.writeText(window.location.href);
   }

   onQueryChange() {
      this.updateUrl();
      this.loadGenes();
   }
}
