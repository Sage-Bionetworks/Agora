import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isMobile = false;
  isShown = false;

  navItems: Array<any> = [];
  defaultNavItems: Array<any> = [
    {
      label: 'Home',
      routerLink: [''],
      activeOptions: { exact: true },
    },
    {
      label: 'Gene Comparison',
      routerLink: ['genes/comparison'],
    },
    {
      label: 'Nominated Targets',
      routerLink: ['genes/nominated-targets'],
    },
    {
      label: 'Teams',
      routerLink: ['teams'],
    },
    {
      label: 'News',
      routerLink: ['news'],
    },
  ];
  mobileNavItems: Array<any> = [
    {
      label: 'About',
      routerLink: ['about'],
    },
    {
      label: 'Help',
      url: 'https://help.adknowledgeportal.org/apd/Agora-Help.2663088129.html',
      target: '_blank',
    },
    {
      label: 'Terms of Service',
      url: 'https://s3.amazonaws.com/static.synapse.org/governance/SageBionetworksSynapseTermsandConditionsofUse.pdf?v=5',
      target: '_blank',
    },
  ];

  ngOnInit() {
    this.onResize();
  }

  refreshNavItems() {
    if (this.isMobile) {
      this.navItems = [...this.defaultNavItems, ...this.mobileNavItems];
    } else {
      this.navItems = this.defaultNavItems;
    }
  }

  onResize() {
    this.isMobile = window.innerWidth < 1320;
    this.refreshNavItems();
  }

  toggleNav() {
    this.isShown = !this.isShown;
  }

  onSearchNavigation() {
      this.toggleNav()
  }
}
