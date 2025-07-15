import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    getApiUrl(): string {
        return environment.apiUrl;
    };

    getAuthUrl(): string {
        return environment.authUrl;
    }

    getUploadsUrl(): string {
        return environment.uploadsUrl;
    }

    getStaticUrl(): string {
        return environment.staticUrl;
    }
}
