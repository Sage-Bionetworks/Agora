import { Component, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import domtoimage from 'dom-to-image-more';
import { saveAs } from 'file-saver';

interface Type {
  value: string;
  label: string;
}

@Component({
  selector: 'download-dom-image',
  templateUrl: './download-dom-image.component.html',
  styleUrls: ['./download-dom-image.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DownloadDomImageComponent {
  @Input() target: HTMLElement = {} as HTMLElement;
  @Input() heading = 'Download this plot as:';
  @Input() filename = 'agora';

  selectedType = '.png';
  types: Type[] = [
    {
      value: '.png',
      label: 'PNG',
    },
    {
      value: '.jpeg',
      label: 'JPEG',
    },
  ];

  error = '';
  isLoading = false;
  resizeTimer: ReturnType<typeof setTimeout> | number = 0;

  @ViewChild('op', { static: true }) overlayPanel: OverlayPanel =
    {} as OverlayPanel;

  constructor() {}

  download() {
    if (this.isLoading) {
      return;
    }

    const self = this;
    this.error = '';
    this.isLoading = true;

    domtoimage
      .toBlob(this.target, { bgcolor: '#fff' })
      .then((blob: any) => {
        saveAs(blob, this.filename + this.selectedType);
        this.isLoading = false;
        this.hide();
      })
      .catch(function (err: string) {
        self.error = 'Oops, something went wrong!';
        console.error(err);
      });
  }

  hide() {
    this.error = '';
    this.overlayPanel.hide();
  }

  onRotate() {
    this.hide();
  }

  onResize() {
    const self = this;
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(function () {
      self.hide();
    }, 0);
  }
}
