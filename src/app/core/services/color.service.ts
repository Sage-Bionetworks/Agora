import { Injectable, Input } from '@angular/core';

import * as d3 from 'd3';
import colorbrewer from 'colorbrewer';

@Injectable()
export class ColorService {
    @Input() domain: number[] = [0, 200];
    @Input() scale: any = d3.scaleQuantile();
    @Input() schemeSelect: string = "Oranges";
    @Input() scheme: any;
    @Input() quantiles: number = 5;
    @Input() singleColorIndex: number = 1;
    @Input() range: string[];
    @Input() palette: any;

    constructor() {
        //this.scheme = colorbrewer[this.schemeSelect];
        this.scheme = ["#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"];
        this.range = (this.singleColorIndex >= 0) ? [this.scheme[this.quantiles][this.singleColorIndex]] : this.scheme[this.quantiles]
        this.palette = this.scale.range(this.range);
    }

    setSingleColorIndex(index: number) {
        this.singleColorIndex = index;
    }
}
