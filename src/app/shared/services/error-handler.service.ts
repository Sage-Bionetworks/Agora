import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
    constructor(
        private injector: Injector,
        private messageService: MessageService
    ) { }

    handleError(error) {
        const self = this;

        this.messageService.clear();
        this.messageService.add({
            severity: 'warn',
            sticky: true,
            summary: 'Error',
            detail: 'An unexpected error has occurred, we recommend reloading the application.'
        });
        setTimeout(() => { self.messageService.clear(); }, 5000);

        const getCircularReplacer = () => {
            const seen = new WeakSet();
            return (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) {
                        return;
                    }
                    seen.add(value);
                }
                return value;
            };
        };

        console.error(JSON.stringify(error, getCircularReplacer()));
        throw error;
    }
}
