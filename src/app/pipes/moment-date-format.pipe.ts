import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
    standalone: true,
    name: 'momentDateFormat'
})
export class MomentDateFormatPipe implements PipeTransform {
    transform(value: Date | string | null, format: string = 'DD.MM.YYYY'): string {
        return value ? moment(value).format(format) : '';
    }
}