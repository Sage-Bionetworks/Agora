import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import screenfull from 'screenfull';

import { Gene } from '../../../../models';
import { HelperService } from '../../../../core/services';

interface TableColumn {
  field: string;
  header: string;
  selected?: boolean;
  width?: number;
}

@Component({
  selector: 'gene-table',
  templateUrl: './gene-table.component.html',
  styleUrls: ['./gene-table.component.scss'],
})
export class GeneTableComponent implements OnInit {
  _genes: Gene[] = [];
  get genes(): Gene[] {
    return this._genes;
  }
  @Input() set genes(genes: Gene[]) {
    this._genes = genes.map((gene) => {
      gene.hgnc_symbol = gene.hgnc_symbol || gene.ensembl_gene_id;
      return gene;
    });
  }

  // Search ----------------------------------------------------------------- //

  _searchTerm = '';
  get searchTerm(): string {
    return this._searchTerm;
  }
  @Input() set searchTerm(term: string) {
    this._searchTerm = term;
    this.table.filterGlobal(this._searchTerm, 'contains');
  }

  // Columns ---------------------------------------------------------------- //

  @Input() requiredColumns: string[] = ['hgnc_symbol'];
  optionalColumns: TableColumn[] = [];

  _columns: TableColumn[] = [
    { field: 'hgnc_symbol', header: 'Gene Symbol', selected: true },
    { field: 'ensembl_gene_id', header: 'Ensembl Gene ID', selected: true },
  ];
  @Input() get columns(): TableColumn[] {
    return this._columns;
  }
  set columns(columns: TableColumn[]) {
    this._columns = columns.map((c: TableColumn) => {
      if (!c.width) {
        c.width = Math.max(94 + c.header.length * 12, 250);
      }
      return c;
    });
    this.selectedColumns = this.columns.filter(
      (c: TableColumn) => c.selected || this.requiredColumns.includes(c.field)
    );
    this.optionalColumns = this.columns.filter(
      (c: TableColumn) => !this.requiredColumns.includes(c.field)
    );
  }

  _selectedColumns: TableColumn[] = [];
  @Input() get selectedColumns(): TableColumn[] {
    return this._selectedColumns;
  }
  set selectedColumns(column: TableColumn[]) {
    this._selectedColumns = this.columns.filter((c) => column.includes(c));
  }

  @Input() className = '';
  @Input() heading = 'Nominated Target List';
  @Input() exportFilename = 'gene-list.csv';
  @Input() gctLink: boolean | { [key: string]: string } = false;
  @Input() gctLinkTooltip =
    'Use Agora Gene Comparison Tool to compare all genes in this list.';

  @Input() sortField = '';
  @Input() sortOrder = -1;

  @ViewChild('table', { static: true }) table: Table = {} as Table;

  constructor(private helperService: HelperService, private router: Router) {}

  ngOnInit() {}

  customSort(event: any) {
    event.data.sort((gene1: any, gene2: any) => {
      let result = null;
      let value1 = null;
      let value2 = null;

      if ('hgnc_symbol' === event.field) {
        value1 = gene1.hgnc_symbol || gene1.ensembl_gene_id;
        value2 = gene2.hgnc_symbol || gene2.ensembl_gene_id;
      } else {
        value1 = gene1[event.field];
        value2 = gene2[event.field];
      }

      if (value1 == null && value2 != null) {
        result = -1;
      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        // Natural sorting for this score type, which can be >= 10
        if (event.field === 'sm_druggability_display_value') {
          const numericValue1 = parseInt(value1.split(':')[0], 10);
          const numericValue2 = parseInt(value2.split(':')[0], 10);
          if (!isNaN(numericValue1) && !isNaN(numericValue2)) {
            if (numericValue1 < numericValue2) {
              result = -1;
            }
            result = numericValue1 > numericValue2 ? 1 : 0;
          }
        } else {
          result = value1.localeCompare(value2);
        }
      } else {
        result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
      }

      return event.order * (result || 0);
    });
  }

  navigateToGene(gene: any) {
    this.router.navigate(['/genes/' + gene.ensembl_gene_id]);
  }

  isFullscreen() {
    return screenfull && screenfull.isFullscreen;
  }

  getWindowClass(): string {
    return screenfull && !screenfull.isFullscreen
      ? ' pi pi-window-maximize table-icon absolute-icon-left'
      : ' pi pi-window-minimize table-icon absolute-icon-left';
  }

  getFullscreenClass(): string {
    return screenfull && screenfull.isFullscreen ? 'fullscreen-table' : '';
  }

  toggleFullscreen() {
    if (!screenfull.isEnabled) {
      return;
    }

    const el = document.getElementsByClassName('gene-table');

    if (el[0]) {
      if (!screenfull.isFullscreen) {
        screenfull.request(el[0]);
      } else {
        screenfull.exit();
      }
    }
  }

  navigateToGeneComparisonTool() {
    if (typeof this.gctLink === 'object') {
      this.router.navigate(['/genes/comparison'], {
        queryParams: this.gctLink,
      });
    } else {
      const ids: string[] = this._genes.map((g: Gene) => g.ensembl_gene_id);
      this.helperService.setGCTSection(ids);
      this.router.navigate(['/genes/comparison']);
    }
  }
}
