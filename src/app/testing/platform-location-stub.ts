import { PlatformLocation, LocationChangeListener } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class PlatformLocationStub extends PlatformLocation {
    href: string;
    protocol: string;
    hostname: string;
    port: string;
    private _location: any;

    constructor() {
        super();
        this._init();
    }
    _init() {
        this._location = {
            pathname: '',
            search: '',
            hash: ''
        };
    }
    get location(): any { return this._location; }
    getBaseHrefFromDOM(): string { return ''; }
    onPopState(fn: LocationChangeListener): void {
        //
    }
    onHashChange(fn: LocationChangeListener): void {
        //
    }
    get pathname(): string { return this._location.pathname; }
    set pathname(newPath: string) { this._location.pathname = newPath; }
    get search(): string { return this._location.search; }
    get hash(): string { return this._location.hash; }
    pushState(state: any, title: string, url: string): void {
        //
    }
    replaceState(state: any, title: string, url: string): void {
        //
    }
    forward(): void { history.forward(); }
    back(): void {
        //
    }
    getState(): unknown {
        //
        return true;
    }
}
