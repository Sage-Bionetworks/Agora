import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem } from 'primeng/primeng';

// Dummy user for now
// import { User } from '../../models';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [ './navbar.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
    items: MenuItem[];

    constructor(
        private router: Router
    ) { }

    ngOnInit() {
        this.items = [
            {
                label: '',
                icon: 'my-icon',
                items: [
                    {
                        label: 'Your Profile'
                    },
                    {
                        label: 'Settings',
                        icon: 'fa-cog'
                    },
                    {
                        label: 'Log Out',
                        icon: 'fa-sign-out'
                    }
                ]
            }
        ];
    }

    goHome() {
        this.router.navigate(['/']);
    }
}
