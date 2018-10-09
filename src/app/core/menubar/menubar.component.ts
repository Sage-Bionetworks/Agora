import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem } from 'primeng/api';

// Dummy user for now
// import { User } from '../../models';

@Component({
  selector: 'menubar',
  templateUrl: './menubar.component.html',
  styleUrls: [ './menubar.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class MenubarComponent implements OnInit {
    items: MenuItem[];

    constructor(
        private router: Router
    ) { }

    ngOnInit() {
        this.items = [
            {
                label: 'HOME',
                routerLink: ['/genes']
            },
            {
                label: 'COMMUNITY'
            },
            {
                label: '',
                icon: 'fa-search'
            }
        ];
    }

    goHome() {
        this.router.navigate(['/']);
    }
}
