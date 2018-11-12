import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { RouterEvent, NavigationEnd } from '@angular/router';

import { NavigationService } from '../services';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [ './navbar.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
    @ViewChild('navMenu') menu: MenuItem[];
    items: MenuItem[];
    activeItem: MenuItem;
    mobileVisible: boolean = false;

    constructor(
        private navService: NavigationService,
    ) { }

    ngOnInit() {
        this.items = [
            { label: 'Gene Search' },
            { label: 'Nominated Targets' },
            { label: 'Teams' }
        ];
        this.navService.getRouter().events.subscribe((re: RouterEvent) => {
            if (re instanceof NavigationEnd) {
                if (re.url === '/genes' || re.url === '/') {
                    this.activeItem = this.items[0];
                } else if (re.url === '/genes/(genes-router:genes-list)') {
                    this.activeItem = this.items[1];
                } else if (re.url === '/teams-contributing') {
                    this.activeItem = this.items[2];
                } else {
                    this.activeItem = null;
                }
            }
        });
    }

    activateMenu() {
        if (!this.activeItem || (this.activeItem.label !== this.menu['activeItem'].label)) {
            this.activeItem = this.menu['activeItem'];
            if (this.activeItem.label === 'Gene Search') {
                this.goToRoute('genes');
            } else if (this.activeItem.label === 'Nominated Targets') {
                this.goToRoute('/genes', {
                    outlets: {
                        'genes-router': [ 'genes-list' ],
                        'gene-overview': null
                }});
            } else {
                this.goToRoute('teams-contributing');
            }
        }
    }

    goHome() {
        this.goToRoute('/genes');
    }

    goToRoute(path: string, outlets?: any) {
        this.navService.goToRoute(path, outlets);
        setTimeout(() => {
            this.mobileVisible = false;
        }, 300);
    }

    toggleMenu() {
        this.mobileVisible = this.mobileVisible ? false : true;
    }
}
