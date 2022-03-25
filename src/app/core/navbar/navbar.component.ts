import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    AfterContentChecked
} from '@angular/core';
import { RouterEvent, NavigationEnd } from '@angular/router';

import { NavigationService } from '../services';

import { LocalStorageService } from 'ngx-webstorage';

import { MenuItem } from 'primeng/api';
import { SplitButton } from 'primeng/splitbutton';
import { TabMenu } from 'primeng/tabmenu';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [ './navbar.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit, AfterContentChecked {
    @ViewChild('navMenu', {static: false}) menu: TabMenu;
    @ViewChild('mobileMenu', {static: false}) mobileMenu: SplitButton;
    items: MenuItem[];
    mobileItems: MenuItem[];
    activeItem: MenuItem;
    oldActiveItem: MenuItem;
    showMobileMenu: boolean = false;
    showDesktopMenu: boolean = false;
    firstTimeCheck: boolean = true;

    private resizeTimer;

    constructor(
        private navService: NavigationService,
        private localSt: LocalStorageService
    ) { }

    ngOnInit() {
        // Main Menu
        this.items = [
            { label: 'Gene Search' },
            { label: 'Nominated Targets' },
            { label: 'Teams' }
        ];

        // Secondary Menu
        this.mobileItems = [
            { label: 'Gene Search', routerLink: ['genes'] },
            { label: 'Nominated Targets', command: () => {
                this.navService.goToRoute('/genes', {
                    outlets: {
                        'genes-router': [ 'genes-list' ],
                        'gene-overview': null,
                        'evidence-menu': null
                }});
            }},
            { label: 'Teams', routerLink: ['teams-contributing'] },
            { label: 'About', routerLink: ['about'] },
            { label: 'Help', routerLink: ['help'] },
            { label: 'Terms & Privacy', routerLink: ['terms'] }
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

    ngAfterContentChecked() {
        // Small size
        if (this.firstTimeCheck) {
            this.firstTimeCheck = false;
            this.updateVars();
        }
    }

    activateMenu() {
        this.updateActiveItem(true);
    }

    goHome() {
        this.navService.goToRoute('/genes');
    }

    goToRoute(path: string, outlets?: any) {
        this.navService.goToRoute(path, outlets);
    }

    getMobileClass(): string {
        console.log(this.mobileMenu);
        return 'mobile-menu ' + ((this.mobileMenu /*&& this.mobileMenu.overlayVisible*/) ?
            'mobile-menu-open-btn' : 'mobile-menu-closed-btn');
    }

    showMenu(event: Event) {
        // Mimics the splitbutton dropdown button click
        this.mobileMenu.onDropdownClick.emit(event);
        // this.mobileMenu.dropdownClick = true;
        // this.mobileMenu.show();
    }

    showVideo() {
        const shouldShow = this.localSt.retrieve('showVideo');
        if (shouldShow !== undefined) {
            if (this.navService.getRouter().url === '/genes') {
                this.localSt.store('showVideo', !shouldShow);
            } else {
                window.open(
                    'https://player.vimeo.com/video/297609960?autoplay=0&speed=1',
                    '_blank'
                );
            }
        } else {
            this.localSt.store('showVideo', true);
        }
    }

    updateVars() {
        // Small size
        if (window.innerWidth < 945) {
            this.showMobileMenu = true;
            this.showDesktopMenu = false;
        } else {
            this.updateActiveItem();
            this.showMobileMenu = false;
            this.showDesktopMenu = true;
        }
    }

    updateActiveItem(route?: boolean) {
        let label = '';
        if (!this.activeItem) {
            if (this.oldActiveItem) {
                label = this.oldActiveItem.label;
            }
        } else {
            label = this.activeItem.label;
        }

        if (this.menu) {
            if (!this.activeItem || (label !== this.menu.activeItem.label)) {
                this.activeItem = this.menu.activeItem;
                if (this.activeItem && route) {
                    this.changeRoute(this.activeItem.label);
                }
            }
        }
    }

    changeRoute(path: string) {
        if (path === 'Gene Search') {
            this.navService.goToRoute('genes');
        } else if (path === 'Nominated Targets') {
            this.navService.goToRoute('/genes', {
                outlets: {
                    'genes-router': [ 'genes-list' ],
                    'gene-overview': null,
                    'evidence-menu': null
                }
            });
        } else if (path === 'Teams') {
            this.navService.goToRoute('teams-contributing');
        }
    }

    onResize(event?: any) {
        const self = this;

        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(function() {
            self.updateVars();
        }, 100);
    }
}
