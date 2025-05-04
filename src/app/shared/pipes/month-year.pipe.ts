import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'monthYear',
    standalone: true
})
export class MonthYearPipe implements PipeTransform {
    private monthNamesAz: string[] = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul',
        'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
    ];

    transform(value: Date | null): string {
        console.log('MonthYearPipe called with:', value);

        if (!value) return '';

        const month = this.monthNamesAz[value.getMonth()];
        const year = value.getFullYear();
        console.log('Formatted month and year:', `${month}, ${year}`);
        return `${month}, ${year}`;
    }
}
