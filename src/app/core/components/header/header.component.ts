import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isToggled = false;
  isMobile = false;
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
      routerLink: ['help'],
    },
    {
      label: 'Terms of Service',
      url: 'https://s3.amazonaws.com/static.synapse.org/governance/SageBionetworksSynapseTermsandConditionsofUse.pdf?v=5',
      target: '_blank',
    },
  ];

  constructor() {}

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.isMobile = window.innerWidth < 1180;
    if (this.isMobile) {
      this.navItems = [...this.defaultNavItems, ...this.mobileNavItems];
    } else {
      this.navItems = this.defaultNavItems;
    }
  }

  toggleNav() {
    this.isToggled = !this.isToggled;
  }

  onClick() {}
}
