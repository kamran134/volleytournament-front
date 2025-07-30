import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Photo } from '../../../../core/models/photo.model';
import { GalleryService } from '../../services/gallery.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GalleryPhotoDialogComponent } from '../gallery-photo-dialog/gallery-photo-dialog.component';

@Component({
    selector: 'app-gallery-main',
    standalone: true,
    imports: [
        MatGridListModule,
        MatDialogModule,
        CommonModule
    ],
    templateUrl: './gallery-main.component.html',
    styleUrl: './gallery-main.component.scss'
})
export class GalleryMainComponent implements OnInit {
    photos: Photo[] = []; // This should be populated with actual photo data
    selectedPhoto: Photo | null = null;

    constructor(private galleryService: GalleryService, private dialog: MatDialog) { }

    ngOnInit(): void {
        this.loadPhotos();
    }

    loadPhotos(): void {
        this.galleryService.getPhotos({ page: 1, size: 10 }).subscribe({
            next: (response) => {
                this.photos = response.data;

                // временная заглушка для тестирования
                // this.photos = this.photos.map(photo => ({
                //     ...photo,
                //     url: 'https://volleytour.az/' + photo.url // Assuming the URL is relative and needs to be prefixed
                // }));
            },
            error: (error) => {
                console.error('Error loading photos:', error);
            }
        });
    }

    openPhoto(photo: Photo): void {
        this.selectedPhoto = photo;
        this.dialog.open(GalleryPhotoDialogComponent, {
            data: photo,
        });
    }
}
