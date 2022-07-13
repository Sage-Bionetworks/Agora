// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import sanitizeHtml from 'sanitize-html';

// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { HelperService, SynapseApiService } from '../../../core/services';

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
    private helperService: HelperService,
    private sanitizer: DomSanitizer,
    private synapseApiService: SynapseApiService
  ) {}

  ngOnInit() {
    this.loading = true;

    this.synapseApiService
      .getWiki(this.ownerId || 'syn25913473', this.wikiId)
      .subscribe(
        (wiki: any) => {
          if (!wiki) {
            this.helperService.setLoading(false);
            return;
          }

          // Sanitize
          let sanitized = sanitizeHtml(wiki.markdown);

          // Add bold tags
          sanitized = sanitized.replace(/\*\*(.*?)\*\*/g, this.replaceBold);

          // Add syn links
          sanitized = sanitized.replace(
            /\[here\]\((.*?)\)/g,
            this.replaceSynLinks
          );

          // Add emails
          sanitized = sanitized.replace(
            /([a-zA-Z0-9.*_-]+@[a-zA-Z0-9 .*_-]+\.[a-zA-Z0-9*_-]+)/gi,
            this.replaceEmail
          );

          // Add variables
          sanitized = sanitized.replace(/\${(.*?)}/g, this.replaceVariable);

          // Requires bypassSecurityTrustHtml to render iframes (e.g. videos)
          this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(sanitized);
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );
  }

  replaceSynLinks(match: string, content: string) {
    return (
      '<a href="https://synapse.org/#!Synapse:' +
      content +
      '" target="_blank">here</a>'
    );
  }

  replaceBold(match: string, content: string) {
    return '<b>' + content + '</b>';
  }

  replaceVariable(match: string, content: string) {
    let params: any = null;

    try {
      const contentArr = content.split('?');
      params = new URLSearchParams(
        contentArr.length > 1 ? contentArr[1] : contentArr[0]
      );
    } catch (err) {
      console.error(err);
    }

    if (params) {
      if (params.has('vimeoId')) {
        return (
          '<iframe src="https://player.vimeo.com/video/' +
          params.get('vimeoId') +
          '?autoplay=0&speed=1" frameborder="0" allow="autoplay; encrypted-media" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
        );
      }
    }

    return '';
  }

  replaceEmail(match: string, content: string) {
    // Remove all spaces and *
    content = content.replace(/(\s|\*)/g, '');

    if (content) {
      return (
        '<a class="link email-link" href="mailto:' +
        content +
        '">' +
        content +
        '</a>'
      );
    }

    return content;
  }

  getClassName() {
    const className = [this.className];
    if (this.loading) {
      className.push('loading');
    }
    return className;
  }
}
