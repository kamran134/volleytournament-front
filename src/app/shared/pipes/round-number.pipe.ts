import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'roundNumber',
    standalone: true
})
export class RoundNumberPipe implements PipeTransform {

    transform(value: number): string {
        if (value % 1 === 0) {
            return value.toString();
        } else if (!value) return '0';
        return value.toFixed(1);
    }
}
