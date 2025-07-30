import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PhotoResponse } from '../../../core/models/photo.model';
import { ConfigService } from '../../../core/services/config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class GalleryService {

    constructor(private http: HttpClient, private configService: ConfigService) { }

    getPhotos(params: { page: number; size: number; tournaments?: string[]; teams?: string[]; tours?: string[] }): Observable<PhotoResponse> {
        let url: string = `${this.configService.getApiUrl()}/photos?page=${params.page}&size=${params.size}`;
        if (params.tournaments && params.tournaments.length > 0) {
            url = `${url}&tournaments=${params.tournaments.join(',')}`;
        }
        if (params.teams && params.teams.length > 0) {
            url = `${url}&teams=${params.teams.join(',')}`;
        }
        if (params.tours && params.tours.length > 0) {
            url = `${url}&tours=${params.tours.join(',')}`;
        }
        return this.http.get<PhotoResponse>(url, { withCredentials: true });
    }
}
