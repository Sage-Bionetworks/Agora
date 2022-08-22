// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Injectable, Output, EventEmitter } from '@angular/core';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
// N/A

declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean;
  }
}

// -------------------------------------------------------------------------- //
// Service
// -------------------------------------------------------------------------- //
@Injectable()
export class HelperService {
  loading = false;

  gctSelection: string[] = [];
  modelSelection = '';

  @Output() loadingChange: EventEmitter<any> = new EventEmitter();

  setLoading(state: boolean) {
    this.loading = state;
    this.loadingChange.emit(null);
  }

  getLoading() {
    return this.loading;
  }

  getTissueTooltipText(text: string): string {
    switch (text) {
      case 'ACC':
        return 'Anterior Cingulate Cortex';
      case 'AntPFC':
        return 'Anterior Prefrontal Cortex';
      case 'BRAAK':
        return 'Neurofibrillary Tangles';
      case 'CBE':
        return 'Cerebellum';
      case 'CERAD':
        return 'Neuritic Plaques';
      case 'COGDX':
        return 'Clinical Consensus Diagnosis';
      case 'DCFDX':
        return 'Clinical Cognitive Diagnosis';
      case 'DLPFC':
        return 'Dorsolateral Prefrontal Cortex';
      case 'FP':
        return 'Frontal Pole';
      case 'IFG':
        return 'Inferior Frontal Gyrus';
      case 'MFG':
        return 'Middle Frontal Gyrus';
      case 'PCC':
        return 'Posterior Cingulate Cortex';
      case 'PHG':
        return 'Parahippocampal Gyrus';
      case 'STG':
        return 'Superior Temporal Gyrus';
      case 'TCX':
        return 'Temporal Cortex';
      default:
        return '';
    }
  }

  getScrollTop() {
    const supportPageOffset = window.pageXOffset !== undefined;
    const isCSS1Compat = (document.compatMode || '') === 'CSS1Compat';

    if (supportPageOffset) {
      return {
        x: window.pageXOffset,
        y: window.pageYOffset,
      };
    } else if (isCSS1Compat) {
      return {
        x: document.documentElement.scrollLeft,
        y: document.documentElement.scrollTop,
      };
    } else {
      return {
        x: document.body.scrollLeft,
        y: document.body.scrollTop,
      };
    }
  }

  getOffset(el: any) {
    if (!el) {
      return { top: 0, left: 0 };
    }

    const rect = el.getBoundingClientRect();
    const scroll = this.getScrollTop();
    return {
      top: rect.top + scroll.y,
      left: rect.left + scroll.x,
    };
  }

  truncateNumberToFixed(num: number, fixed: number): string {
    /*
     * You might think that truncating a number to a certain number of decimal
     * places in JavaScript would be simple, but then you would be wrong.
     * See https://stackoverflow.com/a/11818658/9723359
     */
    const regex = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
    const matches = num.toString().match(regex);
    return matches ? matches[0] : '';
  }

  getSignificantFigures(n: number, sig = 2) {
    let sign = 1;
    if (n === 0) {
      return 0;
    }
    if (n < 0) {
      n *= -1;
      sign = -1;
    }

    const mult = Math.pow(10, sig - Math.floor(Math.log(n) / Math.LN10) - 1);
    return (Math.round(n * mult) / mult) * sign;
  }

  setGCTSelection(genes: string[]) {
    this.gctSelection = genes;
  }

  getGCTSelection() {
    return this.gctSelection;
  }

  deleteGCTSelection() {
    this.gctSelection = [];
  }

  getColor(name: string) {
    switch (name) {
      case 'primary':
        return '#3c4a63';
        break;
      case 'secondary':
        return '#8b8ad1';
        break;
      case 'tertiary':
        return '#42c7bb';
        break;
      case 'action-primary':
        return '#5081a7';
        break;
      default:
        return '';
    }
  }

  getUrlParam(name: string) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(name);
  }
}
