// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { SynapseApiService } from '../../../core/services';

// -------------------------------------------------------------------------- //
// Component
// -------------------------------------------------------------------------- //
@Component({
  selector: 'wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WikiComponent implements OnInit {
  @Input() ownerId = '';
  @Input() wikiId = '';
  @Input() className = '';

  loading = true;

  safeHtml: SafeHtml | null =
    '<div class="wiki-no-data">No data found...</div>';

  constructor(
    private synapseApiService: SynapseApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loading = true;

    this.synapseApiService
      .getWiki(this.ownerId || 'syn25913473', this.wikiId)
      .subscribe(
        (wiki: any) => {
          if (!wiki) {
            this.loading = false;
            return;
          }

          const sanitized = this.synapseApiService.renderHtml(wiki.markdown);

          // Requires bypassSecurityTrustHtml to render iframes (e.g. videos)
          this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(sanitized);
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );
  }

  getClassName() {
    const className = [this.className];
    if (this.loading) {
      className.push('loading');
    }
    return className;
  }
}
