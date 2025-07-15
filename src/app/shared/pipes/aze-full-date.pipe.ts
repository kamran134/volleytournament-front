import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'azeFullDate',
    standalone: true
})
export class AzeFullDatePipe implements PipeTransform {

    transform(date: Date | string | null, showTime?: boolean): string {
        const months = [
            'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
            'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'
        ];

        if (!date) return '';
        if (typeof date === 'string') {
            date = new Date(date);
        }
        const day = String(date.getDate());
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const time = showTime ? `, ${hours}:${minutes}` : '';
        return `${day} ${month} ${year}${time}`;
    }

}
