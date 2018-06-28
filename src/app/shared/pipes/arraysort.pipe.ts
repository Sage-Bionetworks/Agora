import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'myArraySort'
})
export class MyArraySortPipe implements PipeTransform {
    transform(array: any[], field: string, reverse: boolean = false): any[] {
        array.sort((a: any, b: any) => {
            if (a[field].length < b[field].length) {
                return -1;
            } else if (a[field].length > b[field].length) {
                return 1;
            } else {
                return 0;
            }
        });
        if (reverse) {
            array.reverse();
        }
        return array;
    }
}
