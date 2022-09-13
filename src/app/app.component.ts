// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Component, OnInit } from '@angular/core';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import browserUpdate from 'browser-update';
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
  title = 'Agora';
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

  ngOnInit() {
    this.initBrowserUpdate(this.buOptions);
  }

  initBrowserUpdate(options: { [key: string]: any }) {
    browserUpdate(options);
  }
}
