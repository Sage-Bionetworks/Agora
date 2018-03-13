/* tslint:disable */

import { ApplicationRef, NgModuleRef } from '@angular/core';
import { enableDebugTools } from '@angular/platform-browser';
import { Environment } from './model';

Error.stackTraceLimit = Infinity;
require('zone.js/dist/long-stack-trace-zone');

export const environment = {
    production: false,

    showDevModule: true,

    /** Angular debug tools in the dev console
     * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
     * @param modRef
     * @return {any}
     */
    decorateModuleRef(modRef: NgModuleRef<any>) {
        const appRef = modRef.injector.get(ApplicationRef);
        const cmpRef = appRef.components[0];

        let _ng = (<any>window).ng;
        enableDebugTools(cmpRef);
        (<any>window).ng.probe = _ng.probe;
        (<any>window).ng.coreTokens = _ng.coreTokens;
        return modRef;
    },
    ENV_PROVIDERS: [

    ],

    // Initialize Firebase
    firebaseConfig: {
        apiKey: 'AIzaSyBMS96wgJfydRf7BLDVh4DGtRKAZT8UpTM',
        authDomain: 'wall-of-targets.firebaseapp.com',
        databaseURL: 'https://wall-of-targets.firebaseio.com',
        projectId: 'wall-of-targets',
        storageBucket: 'wall-of-targets.appspot.com',
        messagingSenderId: '256222676709'
    }
};

