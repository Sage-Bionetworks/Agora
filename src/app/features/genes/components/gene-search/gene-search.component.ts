// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { fromEvent, Observable, empty, throwError } from 'rxjs';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { Gene, GenesResponse } from '../../../../models';
import { ApiService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Component
// -------------------------------------------------------------------------- //
@Component({
  selector: 'gene-search',
  templateUrl: './gene-search.component.html',
  styleUrls: ['./gene-search.component.scss'],
})
export class GeneSearchComponent implements AfterViewInit {
  results: Gene[] = [];
  isLoading = false;
  isEnsemblId = false;
  isFocused = false;
  query = '';
  error = '';
  hgncSymbolCounts: { [key: string]: number } = {};

  errorMessages: { [key: string]: string } = {
    hgncSymbolNotFound:
      'No results found. Try searching by the Ensembl Gene ID.',
    ensemblIdNotFound:
      'Unable to find a matching gene. Try searching by gene symbol.',
    notValidSearch: 'Please enter at least two characters.',
    notValidEnsemblId:
      'You must enter a full 15-character value to search for a gene by Ensembl identifier.',
    unknown: 'An unknown error occurred, please try again.',
  };

  @ViewChild('root') root: ElementRef = {} as ElementRef;
  @ViewChild('input') input: ElementRef = {} as ElementRef;

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.root.nativeElement.contains(event.target)) {
      this.isFocused = false;
    }
  }

  constructor(private router: Router, private apiService: ApiService) {}

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        //filter(Boolean),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((event: any) => {
          return this.search(event.target.value);
        }),
        catchError((err) => {
          this.error = this.errorMessages.unknown;
          this.isLoading = false;
          return throwError(err);
        })
      )
      .subscribe((data: any) => {
        this.setResults(data.items);
      });
  }

  search(query: string): Observable<GenesResponse> {
    this.results = [];
    this.error = '';
    this.query = query = query.trim().replace(/[^a-z0-9-_]/gi, '');
    this.isEnsemblId = 'ensg' === query.toLowerCase().substring(0, 4);

    if (query.length > 0 && query.length < 2) {
      this.error = this.errorMessages.notValidSearch;
    } else if (this.isEnsemblId) {
      const digits = query.toLowerCase().substring(4, query.length);
      if (digits.length !== 11 || !/^\d+$/.test(digits)) {
        this.error = this.errorMessages.notValidEnsemblId;
      }
    }

    this.isLoading = query && !this.error ? true : false;
    return this.isLoading ? this.apiService.searchGene(query) : empty();
  }

  setResults(results: Gene[]) {
    // If we got an empty array as response, or no genes found
    if (results.length < 1) {
      this.error = this.isEnsemblId
        ? this.errorMessages.ensemblIdNotFound
        : this.errorMessages.hgncSymbolNotFound;
    } else {
      if (this.isEnsemblId) {
        // Multiple matching genes: This should never happen…but if it does, log an error
        if (results.length > 1) {
          console.log(
            'Unexpected duplicate gene_info objects for ensembl ID "' +
              this.query +
              '" found.'
          );
          this.error = this.errorMessages.ensemblIdNotFound;
        } else {
          this.goToGene(results[0].ensembl_gene_id);
        }
      } else {
        this.hgncSymbolCounts = {};
        for (const item of results) {
          if (item.hgnc_symbol) {
            if (!this.hgncSymbolCounts[item.hgnc_symbol]) {
              this.hgncSymbolCounts[item.hgnc_symbol] = 1;
            } else {
              this.hgncSymbolCounts[item.hgnc_symbol]++;
            }
          }
        }
      }
    }

    this.results = results;
    this.isLoading = false;
  }

  goToGene(id: string) {
    this.router.navigate(['/genes/' + id]);
  }

  hasAlias(hgnc: string): boolean {
    return !hgnc.includes(this.query.toUpperCase());
  }
}
