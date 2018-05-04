import { Injectable } from '@angular/core';

export interface InternalStateType {
    [key: string]: any;
}

@Injectable()
export class AppState {
    _state: InternalStateType = { };

    /**
     * Already return a clone of the current state.
     */
    get state() {
        return this._state = this._clone(this._state);
    }
    /**
     * Never allow mutation
     */
    set state(value) {
        throw new Error('do not mutate the `.state` directly');
    }

    get(prop?: any) {
        /**
         * Use our state getter for the clone.
         */
        const state = this.state;
        return state.hasOwnProperty(prop) ? state[prop] : state;
    }

    set(prop: string, value: any) {
        /**
         * Internally mutate our state.
         */
        return this._state[prop] = value;
    }

    private _clone(object: InternalStateType) {
        /**
         * Simple object clone.
         */
        return JSON.parse(JSON.stringify( object ));
    }
}
