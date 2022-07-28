// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Component, Input, OnInit } from '@angular/core';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
// N/A

// -------------------------------------------------------------------------- //
// Services
// -------------------------------------------------------------------------- //
import { HelperService } from '../../../core/services';

// -------------------------------------------------------------------------- //
// Component
// -------------------------------------------------------------------------- //
@Component({
  selector: 'loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
})
export class LoadingOverlayComponent implements OnInit {
  @Input() isGlobal = false;
  @Input() isActive = false;

  constructor(private helperService: HelperService) {}

  ngOnInit() {
    if (this.isGlobal) {
      this.helperService.loadingChange.subscribe(() => {
        this.isActive = this.helperService.getLoading();
      });
    }
  }
}
