// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import {
  Component,
  ViewChild,
  ViewEncapsulation,
  OnInit,
  AfterViewInit as AVI,
  OnDestroy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { cloneDeep } from 'lodash';

import { Table } from 'primeng/table';
import { SortEvent, MessageService, FilterService } from 'primeng/api';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import {
  GCTSelectOption,
  GCTFilter,
  GCTGene,
  GCTSortEvent,
  GCTGeneTissue,
  GCTDetailsPanelData,
  GCTColumn,
  OverallScoresDistribution,
} from '../../../../models';

import { GeneService } from '../../services';
import { HelperService } from '../../../../core/services';

import * as variables from './gene-comparison-tool.variables';
import * as helpers from './gene-comparison-tool.helpers';

import {
  GeneComparisonToolScorePanelComponent as ScorePanelComponent,
  GeneComparisonToolDetailsPanelComponent as DetailsPanelComponent,
  GeneComparisonToolFilterPanelComponent as FilterPanelComponent,
  GeneComparisonToolPinnedGenesModalComponent as PinnedGenesModalComponent,
} from './';

@Component({
  selector: 'gene-comparison-tool',
  templateUrl: './gene-comparison-tool.component.html',
  styleUrls: ['./gene-comparison-tool.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GeneComparisonToolComponent implements OnInit, AVI, OnDestroy {
  /* Genes ----------------------------------------------------------------- */
  genes: GCTGene[] = [];

  /* Categories ------------------------------------------------------------ */
  categories: GCTSelectOption[] = cloneDeep(variables.categories);
  category = '';
  subCategories: GCTSelectOption[] = [];
  subCategory = '';
  subCategoryLabel = '';

  /* Columns --------------------------------------------------------------- */
  columns: string[] = [];
  columnWidth = 'auto';

  scoresColumns: GCTColumn[] = [
    { field: 'RISK SCORE', header: 'AD Risk Score', selected: true, visible: true },
    { field: 'GENETIC', header: 'Genetic Score', selected: true, visible: true },
    { field: 'MULTI-OMIC', header: 'Genomic Score', selected: true, visible: true },
  ];

  brainRegionsColumns: GCTColumn[] = [
    { field: 'ACC', header: 'ACC - Anterior Cingulate Cortex', selected: true, visible: true },
    { field: 'CBE', header: 'CBE - Cerebellum', selected: true, visible: true },
    { field: 'DLPFC', header: 'DLPFC - Dorsolateral Prefrontal Cortex', selected: true, visible: true },
    { field: 'FP', header: 'FP - Frontal Pole', selected: true, visible: true },
    { field: 'IFG', header: 'IFG - Inferior Frontal Gyrus', selected: true, visible: true },
    { field: 'PCC', header: 'PCC - Posterior Cingulate Cortex', selected: true, visible: true },
    { field: 'PHG', header: 'PHG - Parahippocampal Gyrus', selected: true, visible: true },
    { field: 'STG', header: 'STG - Superior Temporal Gyrus', selected: true, visible: true },
    { field: 'TCX', header: 'TCX - Temporal Cortex', selected: true, visible: true },
  ];

  scoresDistribution: OverallScoresDistribution[] = [];

  /* Sort ------------------------------------------------------------------ */
  sortField = '';
  sortOrder = -1;

  /* Filters --------------------------------------------------------------- */
  filters: GCTFilter[] = cloneDeep(variables.filters);
  searchTerm = '';

  /* URL ------------------------------------------------------------------- */
  urlParams: { [key: string]: any } | undefined;
  urlParamsSubscription: Subscription | undefined;

  /* Pinned ---------------------------------------------------------------- */
  pinnedGenes: GCTGene[] = [];
  pinnedGenesCache: { [key: string]: GCTGene[] } = {};
  pendingPinnedGenes: GCTGene[] = [];
  maxPinnedGenes = 50;

  /* ----------------------------------------------------------------------- */
  private DEFAULT_SIGNIFICANCE_THRESHOLD = 0.05;
  significanceThreshold = this.DEFAULT_SIGNIFICANCE_THRESHOLD;
  significanceThresholdActive = false;

  /* Components ------------------------------------------------------------ */
  @ViewChild('headerTable', { static: true }) headerTable!: Table;
  @ViewChild('pinnedTable', { static: true }) pinnedTable!: Table;
  @ViewChild('genesTable', { static: true }) genesTable!: Table;

  @ViewChild('filterPanel') filterPanel!: FilterPanelComponent;
  @ViewChild('detailsPanel') detailsPanel!: DetailsPanelComponent;
  @ViewChild('scorePanel') scorePanel!: ScorePanelComponent;
  @ViewChild('pinnedGenesModal') pinnedGenesModal!: PinnedGenesModalComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private geneService: GeneService,
    private helperService: HelperService,
    private messageService: MessageService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.urlParamsSubscription = this.route.queryParams.subscribe((params) => {
      this.urlParams = params || {};

      this.category = this.urlParams.category || this.categories[0].value;
      this.subCategory = this.urlParams.subCategory || '';
      this.updateSubCategories();

      this.sortField = this.urlParams.sortField || '';
      this.sortOrder = '1' === this.urlParams.sortOrder ? 1 : -1;

      this.significanceThreshold =
        this.urlParams.significanceThreshold ||
        this.DEFAULT_SIGNIFICANCE_THRESHOLD;
      this.significanceThresholdActive = !!this.urlParams.significanceThreshold;

      this.loadGenes();
    });

    this.filterService.register('intersect', helpers.intersectFilterCallback);
    this.filterService.register(
      'exclude_ensembl_gene_id',
      helpers.excludeEnsemblGeneIdFilterCallback
    );
  }

  ngAfterViewInit() {
    const self = this;
    setTimeout(() => {
      self.updateColumnWidth();
    }, 1);
  }

  ngOnDestroy() {
    this.urlParamsSubscription?.unsubscribe();
  }

  isScoresColumn(column: string) {
    const isScore = this.scoresColumns.find(c => c.field === column);
    return isScore !== undefined;
  }

  toggleGCTColumn(column: GCTColumn) {
    column.selected = !column.selected;
    this.updateVisibleColumns();
    this.onResize();
  }

  updateVisibleColumns() {
    const visibleScoresColumns: string[] = 
      this.scoresColumns
        .filter(c => c.visible && c.selected)
        .map(c => c.field);
    const visibleBrainRegionColumns: string[] = 
      this.brainRegionsColumns
        .filter(c => c.visible && c.selected)
        .map(c => c.field);
    this.columns = visibleScoresColumns.concat(visibleBrainRegionColumns);
  }

  public isNumber(value: string | number): boolean
  {
    return ((value != null) &&
            (value !== '') &&
            !isNaN(Number(value.toString())));
  }


  /* ----------------------------------------------------------------------- */
  /* Genes
  /* ----------------------------------------------------------------------- */

  getScoreForNumericColumn(columnName: string, gene: GCTGene) {
    if (columnName === this.scoresColumns[0].field) {
      return gene.target_risk_score;
    }
    if (columnName === this.scoresColumns[1].field) {
      return gene.genetics_score;
    }
    if (columnName === this.scoresColumns[2].field) {
      return gene.multi_omics_score;
    }
    return null;
  }

  loadGenes() {
    this.helperService.setLoading(true);
    this.genes = [];

    const genesApi$ = this.geneService.getComparisonGenes(this.category, this.subCategory);
    const distributionApi$ = this.geneService.getDistribution();

    combineLatest([genesApi$, distributionApi$]).subscribe(
      ([genesResult, distributionResult]) => {
        this.initData(genesResult.items);
        this.sortTable(this.headerTable);
        this.refresh();

        this.scoresDistribution = distributionResult.overall_scores;
        this.helperService.setLoading(false);
      });
  }

  getGeneProperty(gene: GCTGene, property: string) {
    return property.split('.').reduce((o: any, i: any) => o[i], gene);
  }

  initData(genes: GCTGene[]) {
    this.brainRegionsColumns.forEach(c => c.visible = false);

    const pinnedGenes: GCTGene[] = [];
    const currentPinnedGenesCache = this.getPinnedGenesCache(
      this.category,
      this.subCategory
    );
    const urlPins = currentPinnedGenesCache.length
      ? currentPinnedGenesCache.map((g: GCTGene) => g.uid)
      : this.getUrlParam('pinned', true);

    genes.forEach((gene: GCTGene) => {
      gene.uid = gene.ensembl_gene_id;
      gene.search_array = [
        gene.ensembl_gene_id.toLowerCase(),
        gene.hgnc_symbol.toLowerCase(),
      ];

      if ('Protein - Differential Expression' === this.category) {
        gene.uid += gene.uniprotid;
        gene.search_array.push(gene.uniprotid?.toLowerCase() || '');

        if (
          urlPins.includes(gene.uid) ||
          urlPins.includes(gene.ensembl_gene_id)
        ) {
          pinnedGenes.push(gene);
        }
      } else {
        // Filter to get a list of ENSGs
        if (
          urlPins.map((id: string) => id.substring(0, 15)).includes(gene.uid)
        ) {
          pinnedGenes.push(gene);
        }
      }

      gene.search_string = gene.search_array.join();

      this.filters.forEach((filter: GCTFilter) => {
        if (!filter.field) {
          return;
        }

        const value = this.getGeneProperty(gene, filter.field);

        if (value) {
          if (Array.isArray(value)) {
            value.forEach((v: any) => {
              this.setFilterOption(filter.name, v);
            });
          } else {
            this.setFilterOption(filter.name, value);
          }
        }
      });

      // add tissue columns
      gene.tissues?.forEach((tissue: GCTGeneTissue) => {
        //if (!this.brainRegionsColumns.map(c => c.field).includes(tissue.name)) {
        const column = this.brainRegionsColumns.find(c => c.field === tissue.name);
        if (column)
          column.visible = true;
        //}
      });
    });

    this.updateVisibleColumns();

    if (!this.sortField || !this.columns.includes(this.sortField)) {
      this.sortField = this.columns[0];
    }

    const preSelection = this.helperService.getGCTSelection();
    this.helperService.deleteGCTSelection();
    if (preSelection?.length) {
      this.searchTerm = preSelection.join(',');
    }

    if (pinnedGenes.length) {
      pinnedGenes.sort((a, b) =>
        a.ensembl_gene_id > b.ensembl_gene_id ? 1 : -1
      );

      if (
        'Protein - Differential Expression' === this.category &&
        pinnedGenes.length > this.maxPinnedGenes
      ) {
        this.pendingPinnedGenes = pinnedGenes;
        this.pinnedGenesModal.show();
      } else {
        this.pinnedGenes = [];
        this.pendingPinnedGenes = [];
        this.pinGenes(pinnedGenes);
      }
    }

    this.genes = genes;
  }

  /* ----------------------------------------------------------------------- */
  /* Categories
  /* ----------------------------------------------------------------------- */

  updateSubCategories() {
    if ('Protein - Differential Expression' === this.category) {
      this.subCategoryLabel = 'Profiling Method';
    } else {
      this.subCategoryLabel = 'Models';
    }

    this.subCategories = cloneDeep(variables.subCategories)[this.category];

    if (
      !this.subCategory ||
      !this.subCategories.find(
        (c: GCTSelectOption) => c.value === this.subCategory
      )
    ) {
      this.subCategory = this.subCategories[0]?.value;
    }
  }

  onCategoryChange() {
    // Make sure we clear the protein cache so pins are converted from RNA to Protein
    if (this.category === 'RNA - Differential Expression') {
      this.clearPinnedGenesCache('Protein - Differential Expression');
    }

    this.updateSubCategories();
    this.updateUrl();
    this.loadGenes();
  }

  onSubCategoryChange() {
    this.updateUrl();
    this.loadGenes();
  }

  /* ----------------------------------------------------------------------- */
  /* Significance Threshold
  /* ----------------------------------------------------------------------- */

  setSignificanceThresholdActive(significanceThresholdActive: boolean) {
    this.significanceThresholdActive = significanceThresholdActive;
    this.filter();
    this.updateUrl();
  }

  /* ----------------------------------------------------------------------- */
  /* Filters
  /* ----------------------------------------------------------------------- */

  setFilters(filters: any) {
    this.filters = filters;
    this.filter();
    this.updateUrl();
  }

  getFilterValues() {
    const values: { [key: string]: string | number | string[] | number[] } = {};

    for (const filter of this.filters) {
      const value: string[] = [];
      for (const option of filter.options.filter((o) => o.selected)) {
        value.push(option.value);
      }
      if (value.length) {
        values[filter.name] = value;
      }
    }

    return values;
  }

  setFilterOption(name: string, value: string | number | string[] | number[]) {
    const filter = this.filters.find((f) => f.name === name);

    if (!filter || !value) {
      return;
    }

    const option = filter?.options.find((option) => value === option.value);
    const urlParam = filter ? this.getUrlParam(filter.name, true) : [];
    const isSelected =
      urlParam &&
      urlParam.indexOf(typeof value === 'string' ? value : String(value)) !==
        -1;

    if (!option) {
      filter.options.push({
        label: helpers.filterOptionLabel(value),
        value,
        selected: isSelected,
      });

      filter.options.sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        } else if (a.label > b.label) {
          return 1;
        }
        return 0;
      });

      if (filter.order === 'DESC') {
        filter.options.reverse();
      }
    } else if (isSelected) {
      option.selected = isSelected;
    }
  }

  hasSelectedFilters() {
    for (const filter of this.filters) {
      if (filter.options.find((option) => option.selected)) {
        return true;
      }
    }
    return false;
  }

  setSearchTerm(term: string) {
    this.searchTerm = term;
    this.filter();
  }

  clearSearch() {
    this.searchTerm = '';
    this.filter();
  }

  filter() {
    const filters: { [key: string]: any } = {
      ensembl_gene_id: {
        value: this.getPinnedEnsemblGeneIds(),
        matchMode: 'exclude_ensembl_gene_id',
      },
    };

    if (this.searchTerm) {
      if (this.searchTerm.indexOf(',') !== -1) {
        const terms = this.searchTerm
          .toLowerCase()
          .split(',')
          .map((t: string) => t.trim());
        filters['search_array'] = {
          value: terms,
          matchMode: 'intersect',
        };
      } else {
        filters['search_string'] = {
          value: this.searchTerm.toLowerCase(),
          matchMode: 'contains',
        };
      }
    }

    this.filters.forEach((filter) => {
      if (!filter.field) {
        return;
      }

      const values = filter.options
        .filter((option) => option.selected)
        .map((selected) => selected.value);

      if (values.length) {
        filters[filter.field] = {
          value: values,
          matchMode: filter.matchMode || 'equals',
        };
      }
    });

    const filterChanged =
      JSON.stringify({ ...filters, ...{ ensembl_gene_id: '' } }) !==
      JSON.stringify({
        ...this.genesTable.filters,
        ...{ ensembl_gene_id: '' },
      });

    const currentPage = this.genesTable._first;

    this.genesTable.filters = filters;
    this.genesTable._filter();

    // Restoring current pagination if filters didn't change
    if (!filterChanged) {
      this.genesTable._first = currentPage;
    }
  }

  /* ----------------------------------------------------------------------- */
  /* Sort
  /* ----------------------------------------------------------------------- */

  setSort(event: GCTSortEvent) {
    this.sortField = event.field;
    this.sortOrder = event.order;
    this.sort();
    this.updateUrl();
  }

  sortCallback(event: SortEvent) {
    const order = event.order || 1;
    if (!event.field || !event.data) {
      return;
    }
    const isScoresColumnSort = this.scoresColumns.find(c => c.field === event.field);
    if (isScoresColumnSort) {
      // if it is one of the numeric scores
      event.data.sort((a, b) => {
        const value1 = this.getScoreForNumericColumn(event.field as string, a);
        const value2 = this.getScoreForNumericColumn(event.field as string, b);

        if (value1 === value2)
          return 0; // equal so don't do anything
        if (value1 === null)
          return 1; // sort null after everything
        if (value2 === null)
          return -1; // sort null after everything

        const result = (value1 < value2) ? -1 : 1;
        return (order * result);
      });
    } else {
      //it's one of the tissues
      event.data.sort((a, b) => {
        let result = null;

        a = a.tissues.find(
          (tissue: GCTGeneTissue) => tissue.name === event.field
        )?.logfc;

        b = b.tissues.find(
          (tissue: GCTGeneTissue) => tissue.name === event.field
        )?.logfc;

        if (a == null && b != null) result = 1 * order;
        else if (a != null && b == null) result = -1 * order;
        else if (a == null && b == null) result = 0;
        else result = a < b ? -1 : a > b ? 1 : 0;

        return order * result;
      });
    }
  }

  sortTable(table: Table) {
    table.sortField = '';
    table.defaultSortOrder = this.sortOrder;
    table.sort({ field: this.sortField });
  }

  sort() {
    this.sortTable(this.pinnedTable || null);
    this.sortTable(this.genesTable || null);
  }

  /* ----------------------------------------------------------------------- */
  /* Pin/Unpin
  /* ----------------------------------------------------------------------- */

  getPinnedGenesCacheKey(category: string, subCategory?: string) {
    return (category + (subCategory ? '-' + subCategory : ''))
      .replace(/[^a-z0-9]/gi, '')
      .toLowerCase();
  }

  getPinnedGenesCache(category: string, subCategory?: string) {
    const key = this.getPinnedGenesCacheKey(category, subCategory);
    return this.pinnedGenesCache[key] || [];
  }

  setPinnedGenesCache(genes: GCTGene[], category: string, subCategory: string) {
    const key = this.getPinnedGenesCacheKey(category, subCategory);
    this.pinnedGenesCache[key] = genes;
  }

  clearPinnedGenesCache(category?: string, subCategory?: string) {
    if (!category && !subCategory) {
      this.pinnedGenesCache = {};
    } else {
      const key = this.getPinnedGenesCacheKey(category as string, subCategory);

      if (subCategory) {
        delete this.pinnedGenesCache[key];
      } else {
        for (const k in this.pinnedGenesCache) {
          if (k.indexOf(key) === 0) {
            delete this.pinnedGenesCache[k];
          }
        }
      }
    }
  }

  refreshPinnedGenes() {
    this.setPinnedGenesCache(this.pinnedGenes, this.category, this.subCategory);
    this.filter();
    this.updateUrl();
  }

  pinGene(gene: GCTGene, refresh = true) {
    const index = this.pinnedGenes.findIndex(
      (g: GCTGene) => g.uid === gene.uid
    );

    if (index > -1 || this.pinnedGenes.length >= this.maxPinnedGenes) {
      return;
    }

    this.pinnedGenes.push(gene);

    if (refresh) {
      this.clearPinnedGenesCache();
      this.refreshPinnedGenes();
    }
  }

  pinGenes(genes: GCTGene[]) {
    const remaining = this.maxPinnedGenes - this.pinnedGenes.length;

    if (remaining < 1) {
      return;
    } else if (remaining < genes?.length) {
      const self = this;
      this.messageService.clear();
      this.messageService.add({
        severity: 'info',
        sticky: true,
        summary: '',
        detail:
          'Only ' +
          remaining +
          ' genes were added, because you reached the maxium of ' +
          this.maxPinnedGenes +
          ' pinned genes. ',
      });
      setTimeout(() => {
        self.messageService.clear();
      }, 5000);
    }

    genes.slice(0, remaining).forEach((g: GCTGene) => {
      this.pinGene(g, false);
    });

    this.refreshPinnedGenes();
  }

  unpinGene(gene: GCTGene, refresh = true) {
    const index = this.pinnedGenes.findIndex(
      (g: GCTGene) => g.uid === gene.uid
    );

    if (index === -1) {
      return;
    }

    this.pinnedGenes.splice(index, 1);

    if (refresh) {
      this.clearPinnedGenesCache();
      this.refreshPinnedGenes();
    }
  }

  clearPinnedGenes() {
    this.pinnedGenes = [];
    this.clearPinnedGenesCache();
    this.refreshPinnedGenes();
  }

  getPinnedEnsemblGeneIds() {
    return this.pinnedGenes.map((g: GCTGene) => g.ensembl_gene_id);
  }

  pinFilteredGenes() {
    this.pinGenes(this.genesTable.filteredValue);
  }

  onPinnedGenesModalChange(response: boolean) {
    if (response) {
      this.pinnedGenes = [];
      this.pinGenes(this.pendingPinnedGenes);
    } else {
      this.category = this.categories[0].value;
      this.onCategoryChange();
    }
    this.pendingPinnedGenes = [];
  }

  /* ----------------------------------------------------------------------- */
  /* URL
  /* ----------------------------------------------------------------------- */

  getUrlParam(name: string, returnArray = false) {
    if (this.urlParams && this.urlParams[name]) {
      return returnArray && typeof this.urlParams[name] === 'string'
        ? this.urlParams[name].split(',')
        : this.urlParams[name];
    }
    return returnArray ? [] : null;
  }

  updateUrl() {
    const params: { [key: string]: any } = this.getFilterValues();

    if (this.category !== this.categories[0].value) {
      params['category'] = this.category;
    }

    if (this.subCategory !== this.subCategories[0]?.value) {
      params['subCategory'] = this.subCategory;
    }

    if (this.sortField && this.sortField !== this.columns[0]) {
      params['sortField'] = this.sortField;
    }

    if (this.sortOrder != -1) {
      params['sortOrder'] = this.sortOrder;
    }

    if (this.pinnedGenes.length > 0) {
      params['pinned'] = this.pinnedGenes.map(
        (g: GCTGene) => g.uid || g.ensembl_gene_id
      );
      params['pinned'].sort();
    }

    if (this.significanceThresholdActive) {
      params['significanceThreshold'] = [this.significanceThreshold];
    }

    this.urlParams = params;

    let url = this.router.serializeUrl(
      this.router.createUrlTree(['/genes/comparison'])
    );

    if (Object.keys(params).length > 0) {
      url += '?' + new URLSearchParams(params);
    }

    window.history.pushState(null, '', url);
  }

  copyUrl() {
    navigator.clipboard.writeText(window.location.href);
    const self = this;
    this.messageService.clear();
    this.messageService.add({
      severity: 'info',
      sticky: true,
      summary: '',
      detail:
        'URL copied to clipboard! Use this URL to share or bookmark the current table configuration.',
    });
    setTimeout(() => {
      self.messageService.clear();
    }, 5000);
  }

  /* ----------------------------------------------------------------------- */
  /* Details Panel
  /* ----------------------------------------------------------------------- */

  getDetailsPanelData(tissueName: string, gene: GCTGene) {
    const tissue: any = gene.tissues.find((t) => t.name === tissueName);
    if (tissue) {
      return helpers.getDetailsPanelData(
        this.category,
        this.subCategory,
        gene,
        tissue
      );
    }
    return;
  }

  /* ----------------------------------------------------------------------- */
  /* Score Panel
  /* ----------------------------------------------------------------------- */

  getScorePanelData(columnName: string, gene: GCTGene, scoresDistributions: OverallScoresDistribution[] | undefined) {
    // get the scores distribution for the column and row clicked
    if (!scoresDistributions) {
      return;
    }
    return helpers.getScorePanelData(columnName, gene, scoresDistributions);
  }

  /* ----------------------------------------------------------------------- */
  /* Circles
  /* ----------------------------------------------------------------------- */

  nRoot(x: number, n: number) {
    try {
      const negate = n % 2 === 1 && x < 0;
      if (negate) {
        x = -x;
      }
      const possible = Math.pow(x, 1 / n);
      n = Math.pow(possible, n);
      if (Math.abs(x - n) < 1 && x > 0 === n > 0) {
        return negate ? -possible : possible;
      }
      return;
    } catch (e) {
      return;
    }
  }

  getCircleColor(logfc: number) {
    const rounded = this.helperService.getSignificantFigures(logfc, 3);
    if (rounded > 0) {
      if (rounded < 0.1) {
        return '#B5CBEF';
      } else if (rounded < 0.2) {
        return '#84A5DB';
      } else if (rounded < 0.3) {
        return '#5E84C3';
      } else if (rounded < 0.4) {
        return '#3E68AA';
      } else {
        return '#245299';
      }
    } else {
      if (rounded > -0.1) {
        return '#FBB8C5';
      } else if (rounded > -0.2) {
        return '#F78BA0';
      } else if (rounded > -0.3) {
        return '#F16681';
      } else if (rounded > -0.4) {
        return '#EC4769';
      } else {
        return '#D72247';
      }
    }
  }

  getCircleSize(pval: number) {
    if (this.significanceThresholdActive && pval > this.significanceThreshold) {
      return 0;
    }

    const pValue = 1 - (this.nRoot(pval, 3) || 0);
    const size = Math.round(100 * pValue * 0.44);
    return size < 6 ? 6 : size;
  }

  getCircleStyle(tissueName: string, gene: GCTGene) {
    const tissue = gene.tissues.find((t) => t.name === tissueName);
    let size = 0;
    let color = '#F0F0F0';

    if (tissue?.adj_p_val) {
      size = this.getCircleSize(tissue.adj_p_val);
    }

    if (tissue?.logfc) {
      color = this.getCircleColor(tissue.logfc);
    }

    return {
      display: size ? 'block' : 'none',
      width: size + 'px',
      height: size + 'px',
      backgroundColor: color,
    };
  }

  getCircleClass(tissueName: string, gene: GCTGene) {
    let classes = 'gene-indicator';
    const tissue = gene.tissues.find((t) => t.name === tissueName);

    if (tissue) {
      if (tissue.logfc) {
        if (tissue.logfc >= 0) {
          classes += ' plus';
        } else {
          classes += ' minus';
        }
      }
    }

    return classes;
  }

  getCircleTooltip(tissueName: string, gene: GCTGene) {
    const tissue = gene.tissues.find((t) => t.name === tissueName);

    if (tissue) {
      return (
        'L2FC: ' +
        this.helperService.getSignificantFigures(tissue.logfc, 3) +
        '\n' +
        'P-value: ' +
        this.helperService.getSignificantFigures(tissue.adj_p_val, 3) +
        '\n\n' +
        'Click for more details'
      );
    }

    return '';
  }

  isCircleTooltipDisabled() {
    return (
      this.detailsPanel?.panels?.first?.overlayVisible ||
      this.detailsPanel?.panels?.last?.overlayVisible ||
      false
    );
  }

  /* ----------------------------------------------------------------------- */
  /* Download pinned genes as CSV
  /* ----------------------------------------------------------------------- */

  downloadPinnedCsv() {
    const columnHeaders = [
      'ensembl_gene_id',
      'hgnc_symbol',
      'target_risk_score',
      'multi_omic_risk_score',
      'genetic_risk_score',
      'Protein - Differential Expression' === this.category ? 'uniprotid' : 'model',
      'tissue',
      'log2_fc',
      'ci_upr',
      'ci_lwr',
      'adj_p_val',
      'biodomains',
    ];
    const data: any[][] = [];

    this.pinnedGenes.forEach((g: GCTGene) => {
      const baseRow = [
        g.ensembl_gene_id, 
        g.hgnc_symbol, 
        g.target_risk_score, 
        g.multi_omics_score,
        g.genetics_score
      ];

      if ('Protein - Differential Expression' === this.category) {
        baseRow.push(g.uniprotid || '');
      } else {
        baseRow.push(this.subCategory);
      }

      this.columns.forEach((tissueName: string) => {
        if (this.isScoresColumn(tissueName)) {
          return;
        }
        const tissue: GCTGeneTissue | undefined = g.tissues.find(
          (t) => t.name === tissueName
        );
        data.push([
          ...baseRow,
          ...[
            tissueName,
            tissue?.logfc || '',
            tissue?.ci_r || '',
            tissue?.ci_l || '',
            tissue?.adj_p_val || '',
            g.biodomains?.join(',') || '',
          ],
        ]);
      });
    });

    let csv = '';
    csv = this.arrayToCSVString(columnHeaders);

    data.forEach((row) => {
      csv += this.arrayToCSVString(row);
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const filename = (this.category + '-' + this.subCategory)
      .toLowerCase()
      .replace(/( -)|[()]/gi, '')
      .replace(/ /gi, '-');
    a.setAttribute('href', url);
    a.setAttribute('download', filename + '.csv');
    a.click();
  }

  arrayToCSVString(values: string[]): string {
    return values.map(value => `"${value}"`).join(',') + '\n';
  }

  /* ----------------------------------------------------------------------- */
  /* Utils
  /* ----------------------------------------------------------------------- */

  refresh() {
    this.sort();
    this.filter();
    this.updateColumnWidth();
  }

  navigateToGene(gene: GCTGene) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/genes/' + gene.ensembl_gene_id])
    );

    window.open(url, '_blank');
  }

  getGCTColumnTooltipText(columnName: string) {
    return this.helperService.getGCTColumnTooltipText(columnName);
  }

  getGCTColumnSortIconTooltipText(columnName: string) {
    return this.helperService.getGCTColumnSortIconTooltipText(columnName);
  }

  onSearchInput(event: Event) {
    const el = event?.target as HTMLTextAreaElement;
    this.setSearchTerm(el.value);
  }

  updateColumnWidth() {
    const count = this.columns.length < 5 ? 5 : this.columns.length;
    const width =
      this.headerTable?.containerViewChild?.nativeElement?.offsetWidth || 0;
    this.columnWidth = Math.ceil((width - 300) / count) + 'px';
  }

  onResize() {
    this.updateColumnWidth();
  }

  getRoundedGeneData(gene: GCTDetailsPanelData) {
    return {
      l2fc: this.helperService.getSignificantFigures(gene.value || 0, 3),
      pValue: this.helperService.getSignificantFigures(gene.pValue || 0, 3),
    };
  }

  navigateToConsistencyOfChange(data: any) {
    const url = this.router.createUrlTree([
      '/genes/' + data.gene.ensembl_gene_id + '/evidence/rna',
    ]);

    window.open(
      url.toString() + '/?model=' + this.subCategory + '#consistency-of-change',
      '_blank'
    );
  }
}
