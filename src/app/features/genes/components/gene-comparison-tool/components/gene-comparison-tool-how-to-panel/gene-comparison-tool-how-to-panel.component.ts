// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
// import { SynapseApiService } from '../../../../../../core/services';

interface Pane {
  heading: string;
  content: SafeHtml;
}

// -------------------------------------------------------------------------- //
// Component
// -------------------------------------------------------------------------- //
@Component({
  selector: 'gene-comparison-tool-how-to-panel',
  templateUrl: './gene-comparison-tool-how-to-panel.component.html',
  styleUrls: ['./gene-comparison-tool-how-to-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GeneComparisonToolHowToPanelComponent implements OnInit {
  isActive = false;
  willHide = false;
  willHideCookieName = 'gct_hide_how_to';

  panes: Pane[] = [
    {
      heading: 'Error',
      content: '<div class="wiki-no-data">No data found...</div>',
    },
  ];
  activePane = 0;

  loading = false;

  constructor(
    private cookieService: CookieService,
    //private synapseApiService: SynapseApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    if (this.cookieService.get(this.willHideCookieName) !== '1') {
      this.isActive = true;
    } else {
      this.willHide = true;
    }

    this.loadContent();
  }

  loadContent() {
    this.panes = [
      {
        heading: 'Gene Comparison Overview',
        content: this.sanitizer.bypassSecurityTrustHtml(
          `<p>Click on the circle to show detailed information about expression in a specific brain region.</p>
          <img src="/assets/images/gct-how-to-0.png" />`
        ),
      },
      {
        heading: 'View Detailed Expression Info',
        content: this.sanitizer.bypassSecurityTrustHtml(
          `<p>Click on the bubble to show detailed information about expression in a specific brain region.</p>
          <img src="/assets/images/gct-how-to-1.png" />`
        ),
      },
      {
        heading: 'Compare Multiple Genes',
        content: this.sanitizer.bypassSecurityTrustHtml(
          `<p>You can pin several genes to visually compare them together. Then export the data about your pinned genes into the CSV file for further analysis.</p>
          <img src="/assets/images/gct-how-to-2.png" />`
        ),
      },
      {
        heading: 'Filter Gene Selection',
        content: this.sanitizer.bypassSecurityTrustHtml(
          `<p>Filter genes by Nomination, Association with AD, Study and more. Or simply use the search bar to quickly find the genes you are interested in.</p>
          <img src="/assets/images/gct-how-to-3.png" />`
        ),
      },
    ];

    // Uncomment to use wiki page
    // this.loading = true;

    // this.synapseApiService.getWiki('syn25913473', '618351').subscribe(
    //   (wiki: any) => {
    //     if (!wiki) {
    //       this.loading = false;
    //       return;
    //     }

    //     const sanitized = this.synapseApiService.renderHtml(wiki.markdown);
    //     const panes = sanitized.split('<hr />');

    //     this.panes = panes.map((html: string) => {
    //       const headings = html.match('<h4>(.*?)</h4>');
    //       const content = html.replace(/<h4>(.*?)<\/h4>/, '');

    //       return {
    //         heading: headings?.length ? headings[1] : '',
    //         content: this.sanitizer.bypassSecurityTrustHtml(content),
    //       };
    //     });

    //     this.loading = false;
    //   },
    //   () => {
    //     this.loading = false;
    //   }
    // );
  }

  previous() {
    if (this.activePane > 0) {
      this.activePane--;
    }
  }

  next() {
    if (this.activePane < this.panes.length - 1) {
      this.activePane++;
    }
  }

  onHide() {
    this.cookieService.set(this.willHideCookieName, this.willHide ? '1' : '0');
    this.activePane = 0;
  }

  toggle() {
    this.isActive = !this.isActive;
  }
}
