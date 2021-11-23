import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import { DialogsService } from 'app/dialogs/services';
import { Config } from 'plotly.js';
import { ChartData } from '../soe';
@Component({
    selector: 'soechartdialog',
    templateUrl: './soe-chart-dialog.component.html',
    styleUrls: ['./soe-chart-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SOEChartDialogue implements OnInit {
    @Input() display: boolean = false;
    @Input() description: boolean = false;
    @Input() header: string = '';
    @Input() name: string = 'SOE Chart';
    @Input() chartData: ChartData;
    @Input() onHide: () => void;
    config: Config
    layout: Plotly.Layout

    constructor(
        private dialogsService: DialogsService,
    ) {
        dialogsService.displayed$.subscribe((visibleObj: any) => {
            if (visibleObj && visibleObj.name && visibleObj.name === this.name) {
                this.display = (visibleObj.visible) ? visibleObj.visible : false;
            }
        });
    }

    ngOnInit() {
        setTimeout(() => {

            this.config = {
                ...this.chartData.config,
                responsive: true,
            }

            this.layout = {
                ...this.chartData.layout,
                width: undefined,
                height: undefined,
            }
        }, 300)
    }

    // Waiting for the new PrimeNG version
    closeDialog() {
        this.dialogsService.closeDialog(this.name);
        this.onHide()
    }

}
