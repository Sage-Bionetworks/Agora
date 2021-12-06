import {
    AfterViewInit,
    Component,
    Input,
    ElementRef,
    OnChanges,
    ViewChild,
    ViewEncapsulation,
    OnInit,
    OnDestroy,
} from '@angular/core';
import * as React from 'react';
import { SynapseClient } from 'synapse-react-client';
import * as ReactDOM from 'react-dom';
import { SynapseContextProvider } from 'synapse-react-client/dist/utils/SynapseContext';
import PlotlyWrapper, { PlotlyWrapperProps } from 'synapse-react-client/dist/containers/PlotlyWrapper';

@Component({
    selector: 'plotlywrapper',
    templateUrl: './plotly-wrapper.component.html',
    styleUrls: ['./plotly-wrapper.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class PlotlyWrapperComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    @ViewChild('plotlywrapper') containerRef: ElementRef;
    @Input() data: [];
    @Input() layout: {};
    @Input() config: {};
    @Input() containerWidth: number;
    @Input() useResizeHandler: boolean;
    @Input() plotStyle: React.CSSProperties;
    @Input() classNames: string;

    classNameList = 'plotlywrapper ';
    private hasViewLoaded = false;

    constructor() {
        // empty
    }

    public ngOnInit() {
        if (this.classNames) {
            this.classNameList = this.classNameList + this.classNames;
        }
    }

    public ngOnChanges() {
        this.renderComponent();
    }

    public ngAfterViewInit() {
        this.hasViewLoaded = true;
        this.renderComponent();
    }

    public ngOnDestroy() {
        ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement)
    }

    private renderComponent() {
        if (!this.hasViewLoaded) {
            return;
        }

        const plotlyProps: PlotlyWrapperProps = {
            data: this.data,
            layout: this.layout,
            config: this.config,
            containerWidth: this.containerWidth,
            className: this.classNameList,
            useResizeHandler: this.useResizeHandler,
            plotStyle: this.plotStyle
        };
        const plotly = React.createElement(PlotlyWrapper, plotlyProps);
        const props = {
            synapseContext: {
                accessToken: undefined,
                isInExperimentalMode: false,
                utcTime: SynapseClient.getUseUtcTimeFromCookie()
            }
        };
        ReactDOM.render(
            React.createElement(SynapseContextProvider, props, plotly),
            this.containerRef.nativeElement
        );
    }

}
