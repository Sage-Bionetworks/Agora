import { Component, ViewEncapsulation, OnChanges, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MarkdownSynapse, { MarkdownSynapseProps } from 'synapse-react-client/dist/containers/MarkdownSynapse';
import { SynapseClient } from 'synapse-react-client';
import { SynapseContextProvider } from 'synapse-react-client/dist/utils/SynapseContext';

@Component({
    selector: 'news',
    templateUrl: './news.component.html',
    styleUrls: [ './news.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class NewsComponent implements OnChanges, AfterViewInit {
    @ViewChild('wikiNews') containerRef: ElementRef;

    private hasViewLoaded = false;

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
        const newsProps: MarkdownSynapseProps = {
            ownerId: 'syn25913473',
            wikiId: '611426'
        };
        const newsContent = React.createElement(MarkdownSynapse, newsProps);
        const props = {
            synapseContext: {
                accessToken: undefined,
                isInExperimentalMode: false,
                utcTime: SynapseClient.getUseUtcTimeFromCookie()
            }
        };
        ReactDOM.render(
            React.createElement(SynapseContextProvider, props, newsContent),
            this.containerRef.nativeElement
        );
    }
}
