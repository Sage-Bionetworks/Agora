// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import browserUpdate from 'browser-update';
import { filter } from 'rxjs';
import '../styles/styles.scss';

// -------------------------------------------------------------------------- //
// Component
// -------------------------------------------------------------------------- //
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  buOptions: { [key: string]: any } = {
    required: {
      e: -2,
      i: 11,
      f: -3,
      o: -3,
      s: 10.1,
      c: '64.0.3282.16817',
      samsung: 7.0,
      vivaldi: 1.2,
    },
    insecure: true,
  };

  constructor(private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private titleService: Title,
    private metaService: Meta) {
  }

  ngOnInit() {
    this.initBrowserUpdate(this.buOptions);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const route = this.getChildRoute(this.activatedRoute);
      route.data.subscribe((data: any) => {
        if (data.title) {
          this.titleService.setTitle(data.title);
        } else {
          this.titleService.setTitle('Agora');
        }
          
        if (data.description) {
          this.metaService.updateTag({ name: 'description', content: data.description });
        } else {
          this.metaService.removeTag('name=\'description\'');
        }
      });
    });
  }

  getChildRoute(activatedRoute: ActivatedRoute): ActivatedRoute {
    if (activatedRoute.firstChild) {
      return this.getChildRoute(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  initBrowserUpdate(options: { [key: string]: any }) {
    browserUpdate(options);
  }
}
