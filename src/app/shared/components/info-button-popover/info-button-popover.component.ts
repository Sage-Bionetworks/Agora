
import {
    AfterViewInit,
    Component,
    Input,
    ElementRef,
    OnChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import * as React from 'react';
import { SynapseClient } from 'synapse-react-client';
import * as ReactDOM from 'react-dom';
import { SynapseContextProvider } from 'synapse-react-client/dist/utils/SynapseContext';
import { MarkdownPopover, MarkdownPopoverProps } from 'synapse-react-client/dist/containers/MarkdownPopover';

@Component({
    selector: 'infobuttonpopover',
    templateUrl: './info-button-popover.component.html',
    styleUrls: ['./info-button-popover.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class InfoButtonPopoverComponent implements OnChanges, AfterViewInit {

    @ViewChild('infobuttonpopover') containerRef: ElementRef;
    @Input() contentProps: {};
    @Input() placement: "bottom";

    classNameList = 'infobuttonpopover ';
    private hasViewLoaded = false;

    constructor() {
        // empty
    }

    public ngOnChanges() {
        this.renderComponent();
    }

    public ngAfterViewInit() {
        this.hasViewLoaded = true;
        this.renderComponent();
    }

    private renderComponent() {
        if (!this.hasViewLoaded) {
            return;
        }

        const markdownPopoverProps: MarkdownPopoverProps = {
            children: React.createElement('img', { className: "info-icon pointer", src: "/assets/icon/info-icon3.svg"}),
            contentProps: this.contentProps,
            placement: this.placement,
        };
        const plotly = React.createElement(MarkdownPopover, markdownPopoverProps);
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
