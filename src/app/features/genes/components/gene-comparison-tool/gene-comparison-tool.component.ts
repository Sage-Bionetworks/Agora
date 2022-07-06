/* eslint-disable */
// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import {
  Component,
  ViewChild,
  ViewEncapsulation,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
  GCTGeneResponse,
} from '../../../../models';

import { GeneService } from '../../services';
import { HelperService } from '../../../../core/services';

import * as variables from './gene-comparison-tool.variables';
import * as helpers from './gene-comparison-tool.helpers';

import { GeneComparisonToolDetailsPanelComponent } from './';
import { GeneComparisonToolFilterPanelComponent } from './';

@Component({
  selector: 'gene-comparison-tool',
  templateUrl: './gene-comparison-tool.component.html',
  styleUrls: ['./gene-comparison-tool.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GeneComparisonToolComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  /* Genes ----------------------------------------------------------------- */
  genes: GCTGene[] = [];

  /* Categories ------------------------------------------------------------ */
  categories: GCTSelectOption[] = cloneDeep(variables.categories);
  category = '';
  subCategories: GCTSelectOption[] = [];
  subCategory = '';
  subCategoryLabel = '';

  /* Filters --------------------------------------------------------------- */
  filters: GCTFilter[] = cloneDeep(variables.filters);
  searchTerm = '';

  /* ----------------------------------------------------------------------- */
  columns: string[] = [];
  columnWidth = 'auto';

  /* Sort ------------------------------------------------------------------ */
  sortField = '';
  sortOrder = -1;

  /* URL ------------------------------------------------------------------- */
  urlParams: { [key: string]: any } | undefined;
  urlParamsSubscription: Subscription | undefined;

  /* Components ------------------------------------------------------------ */
  @ViewChild('headerTable', { static: true }) headerTable!: Table;
  @ViewChild('pinnedTable', { static: true }) pinnedTable!: Table;
  @ViewChild('genesTable', { static: true }) genesTable!: Table;

  @ViewChild('filterPanel')
  filterPanel!: GeneComparisonToolFilterPanelComponent;
  @ViewChild('detailsPanel')
  detailsPanel!: GeneComparisonToolDetailsPanelComponent;

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

      this.loadGenes();
    });

    this.filterService.register('intersect', helpers.intersectFilterCallback);
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

  /* ----------------------------------------------------------------------- */
  /* Genes
  /* ----------------------------------------------------------------------- */

  loadGenes() {
    this.helperService.setLoading(true);
    this.genes = [];
    this.geneService
      .getComparisonGenes(this.category, this.subCategory)
      .subscribe((res: GCTGeneResponse) => {
        this.initData(res.items);
        this.sortTable(this.headerTable);
        this.refresh();
        this.helperService.setLoading(false);
      });
  }

  getGeneProperty(gene: GCTGene, property: string) {
    return property.split('.').reduce((o: any, i: any) => o[i], gene);
  }

  initData(genes: GCTGene[]) {
    const pinned = this.getUrlParam('pinned', true);
    const columns: string[] = [];

    genes.forEach((gene: GCTGene) => {
      gene.uid = gene.ensembl_gene_id + (gene.uniprotid || '');
      gene.search_string = gene.hgnc_symbol + gene.uid;
      gene.pinned = pinned.includes(gene.uid);

      this.filters.forEach((filter: GCTFilter) => {
        let value = this.getGeneProperty(gene, filter.field);

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

      gene.tissues?.forEach((tissue: GCTGeneTissue) => {
        if (!columns.includes(tissue.name)) {
          columns.push(tissue.name);
        }
      });
    });

    columns.sort();
    this.columns = columns;
    this.sortField = this.sortField || this.columns[0];

    const preSelection = this.helperService.getGCTSection();
    this.helperService.deleteGCTSection();
    if (preSelection?.length) {
      this.searchTerm = preSelection.join(',');
    }

    this.genes = genes;
  }

  /* ----------------------------------------------------------------------- */
  /* Categories
  /* ----------------------------------------------------------------------- */

  updateSubCategories() {
    if ('RNA - Differential Expression' === this.category) {
      this.subCategoryLabel = 'Models';
    } else if ('Protein - Differential Expression' === this.category) {
      this.subCategoryLabel = 'Profiling Method';
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
    this.updateSubCategories();
    this.updateUrl();
    this.loadGenes();
  }

  onSubCategoryChange() {
    this.updateUrl();
    this.loadGenes();
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
    const filter = value ? this.filters.find((f) => f.name === name) : null;

    if (filter && !filter.options.find((option) => value === option.value)) {
      const urlParams = this.getUrlParam(filter.name, true);

      filter.options.push({
        label: helpers.filterOptionLabel(value),
        value,
        selected:
          urlParams &&
          urlParams.indexOf(
            typeof value === 'string' ? value : String(value)
          ) !== -1
            ? true
            : false,
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
    // Pinned Table
    this.pinnedTable.filters['pinned'] = {
      value: true,
      matchMode: 'equals',
    };
    this.pinnedTable._filter();

    // Available Table
    const filters: { [key: string]: any } = {
      pinned: { value: true, matchMode: 'notEquals' },
    };

    if (this.searchTerm) {
      const terms = this.searchTerm.split(',').map((t: string) => t.trim());
      filters['search_string'] = {
        value: terms,
        matchMode: 'intersect',
      };
    }

    this.filters.forEach((filter) => {
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

    this.genesTable.filters = filters;
    this.genesTable._filter();
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

    event.data?.sort((a, b) => {
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

  pinGene(gene: GCTGene) {
    gene.pinned = true;
    this.filter();
    this.updateUrl();
  }

  unpinGene(gene: GCTGene) {
    gene.pinned = false;
    this.filter();
    this.updateUrl();
  }

  clearPinned() {
    this.genes.forEach((g) => {
      g.pinned = false;
    });
    this.filter();
    this.updateUrl();
  }

  hasPinnedGenes() {
    for (const gene of this.genes) {
      if (gene.pinned) {
        return true;
      }
    }
    return false;
  }

  getPinnedGeneList() {
    let pinned: string[] = [];

    this.genes.forEach((g) => {
      if (g.pinned) {
        pinned.push(g.uid || g.ensembl_gene_id);
      }
    });

    return pinned;
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

    if (this.hasPinnedGenes()) {
      params['pinned'] = this.getPinnedGeneList();
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
    return helpers.getDetailsPanelData(
      this.category,
      this.subCategory,
      gene,
      tissue
    );
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
    if (logfc > 0) {
      if (logfc < 0.1) {
        return '#B5CBEF';
      } else if (logfc < 0.2) {
        return '#84A5DB';
      } else if (logfc < 0.3) {
        return '#5E84C3';
      } else if (logfc < 0.4) {
        return '#3E68AA';
      } else {
        return '#245299';
      }
    } else {
      if (logfc > -0.1) {
        return '#FBB8C5';
      } else if (logfc > -0.2) {
        return '#F78BA0';
      } else if (logfc > -0.3) {
        return '#F16681';
      } else if (logfc > -0.4) {
        return '#EC4769';
      } else {
        return '#D72247';
      }
    }
  }

  getCircleSize(pval: number) {
    const pValue = 1 - (this.nRoot(pval, 3) || 0);
    let size = Math.round(100 * pValue * 0.44);
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

  /* ----------------------------------------------------------------------- */
  /* Download pinned genes as CSV
  /* ----------------------------------------------------------------------- */

  downloadPinnedCsv() {
    // Clean up the export file name
    this.pinnedTable.exportFilename = this.pinnedTable.exportFilename
      .toLowerCase()
      .replace(/( -)|[()]/gi, '')
      .replace(/ /gi, '-');

    // Update the table values to include a key for each tissue, mapped to a string containing its data values
    this.pinnedTable._value = (this.pinnedTable._value as GCTGene[]).map(
      (value) => ({
        ...value,
        ...value.tissues.reduce(
          (accumulator, { name: tissueName, ...tissueData }) => ({
            ...accumulator,
            [tissueName]: Object.entries(tissueData)
              .map(([key, value]) => `${key}: ${value}`)
              .join(';'),
          }),
          {}
        ),
      })
    );

    this.pinnedTable.columns = [
      { field: 'ensembl_gene_id' },
      { field: 'hgnc_symbol' },
      ...this.columns.map((c) => ({ field: c })),
    ];

    this.pinnedTable.exportCSV();
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

  getTissueTooltipText(tissue: string) {
    return this.helperService.getTissueTooltipText(tissue);
  }

  onSearchInput(event: Event) {
    const el = event?.target as HTMLTextAreaElement;
    this.setSearchTerm(el.value);
  }

  updateColumnWidth() {
    const width =
      this.headerTable?.containerViewChild?.nativeElement?.offsetWidth || 0;
    this.columnWidth =
      Math.ceil((width - 300) / this.columns.length - 1) + 'px';
  }

  onResize() {
    this.updateColumnWidth();
  }
}
