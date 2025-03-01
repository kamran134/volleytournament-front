import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'monthName',
    standalone: true
})
export class MonthNamePipe implements PipeTransform {
    private monthNamesAz: string[] = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul',
        'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
    ];

    transform(value: Date | string | null): string {
        if (!value) return '';

        const date = new Date(value);
        const month = date.getMonth();
        const year = date.getFullYear();

        return `${this.monthNamesAz[month]}`;
    }

}
