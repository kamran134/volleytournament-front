import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'azeDateTime',
    standalone: true
})
export class AzeDateTimePipe implements PipeTransform {

    transform(value: Date | string | null): string {
        if (!value) return '';
        const date = new Date(value);
        // const options: Intl.DateTimeFormatOptions = {
        //     year: 'numeric',
        //     month: '2-digit',
        //     day: '2-digit',
        //     hour: '2-digit',
        //     minute: '2-digit',
        //     second: '2-digit',
        //     hour12: false,
        //     timeZone: 'Asia/Baku'
        // };
        // return date.toLocaleString('az-AZ', options).replace(',', '');

        // Need format like "dd.MM.yyyy HH:mm"
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

}
