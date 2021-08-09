import {
    AfterViewInit,
    Component,
    Input,
    ElementRef,
    OnChanges,
    ViewChild,
    ViewEncapsulation,
    OnInit,
} from '@angular/core';
import MarkdownSynapse, { MarkdownSynapseProps } from 'synapse-react-client/dist/containers/MarkdownSynapse';
import * as React from 'react';
import { SynapseClient } from 'synapse-react-client';
import * as ReactDOM from 'react-dom';
import { SynapseContextProvider } from 'synapse-react-client/dist/utils/SynapseContext';

@Component({
    selector: 'wiki',
    templateUrl: './wiki.component.html',
    styleUrls: ['./wiki.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class WikiComponent implements OnInit, OnChanges, AfterViewInit {

    @ViewChild('wiki') containerRef: ElementRef;
    @Input() ownId: string;
    @Input() wikiId: string;
    @Input() classNames: string;

    private hasViewLoaded = false;
    classNameList = 'wiki ';

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

    private renderComponent() {
        if (!this.hasViewLoaded || !this.wikiId) {
            return;
        }

        const wikiProps: MarkdownSynapseProps = {
            ownerId: this.ownId || 'syn25913473',
            wikiId: this.wikiId 
        };
        const wikiContent = React.createElement(MarkdownSynapse, wikiProps);
        const props = {
            synapseContext: {
                accessToken: undefined,
                isInExperimentalMode: false,
                utcTime: SynapseClient.getUseUtcTimeFromCookie()
            }
        };
        ReactDOM.render(
            React.createElement(SynapseContextProvider, props, wikiContent),
            this.containerRef.nativeElement
        );
    }

}
