import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: [ './footer.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit {
    constructor(
        private router: Router
    ) { }

    ngOnInit() {
    }
}
