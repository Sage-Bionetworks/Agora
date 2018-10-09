import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DialogsService {
    // Add the new #[field] from TypeScript when it's out
    // https://github.com/Microsoft/TypeScript/issues/24418
    name: string = '';

    // Observable boolean sources
    displayedSource = new Subject<any>();

    // Observable boolean streams
    displayed$ = this.displayedSource.asObservable();

    showDialog(name: string) {
        this.name = name;
        this.displayedSource.next({ name: this.name, visible: true });
    }

    closeDialog(name: string) {
        this.name = '';
        this.displayedSource.next({ name, visible: false });
    }

    // Gets the current open dialog
    getDialogName() {
        return this.name;
    }
}
