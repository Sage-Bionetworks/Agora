import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  navItems: Array<any> = [
    {
      label: 'About',
      routerLink: ['about'],
    },
    {
      label: 'News',
      routerLink: ['news'],
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

  ngOnInit() {}

  getVersion(data?: boolean): string {
    return (data ? DATA_VERSION : VERSION) || '0.0.0';
  }
}
