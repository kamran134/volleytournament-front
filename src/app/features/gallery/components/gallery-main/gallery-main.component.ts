import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Photo } from '../../../../core/models/photo.model';
import { GalleryService } from '../../services/gallery.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GalleryPhotoDialogComponent } from '../gallery-photo-dialog/gallery-photo-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Tournament } from '../../../../core/models/tournament.model';
import { Tour } from '../../../../core/models/tour.model';
import { Team } from '../../../../core/models/team.model';
import { TournamentService } from '../../../tournament/services/tournament.service';

@Component({
    selector: 'app-gallery-main',
    standalone: true,
    imports: [
        MatGridListModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        CommonModule
    ],
    templateUrl: './gallery-main.component.html',
    styleUrl: './gallery-main.component.scss'
})
export class GalleryMainComponent implements OnInit {
    lastPhotos: Photo[] = [];
    photos: Photo[] = []; // This should be populated with actual photo data

    tournaments: Tournament[] = [];
    tours: Tour[] = [];
    teams: Team[] = [];

    selectedPhoto: Photo | null = null;
    selectedTournament: string | null = null;
    selectedTour: string | null = null;

    constructor(private galleryService: GalleryService, private dialog: MatDialog) { }

    ngOnInit(): void {
        this.loadTournaments();
        this.loadLastPhotos();
    }

    loadTournaments(): void {
        this.galleryService.getTournaments().subscribe({
            next: (response) => {
                this.tournaments = response.data;
            },
            error: (error) => {
                console.error('Error loading tournaments:', error);
            }
        });
    }

    loadTours(): void {
        if (this.selectedTournament) {
            this.galleryService.getTours(this.selectedTournament).subscribe({
                next: (response) => {
                    this.tours = response.data;
                    this.loadPhotos();
                },
                error: (error) => {
                    console.error('Error loading tours:', error);
                }
            });
        }
    }

    loadLastPhotos(): void {
        this.galleryService.getLastPhotos().subscribe({
            next: (response) => {
                this.lastPhotos = response.data;

                //временная заглушка для тестирования
                // this.lastPhotos = this.lastPhotos.map(photo => ({
                //     ...photo,
                //     url: 'https://volleytour.az/' + photo.url // Assuming the URL is relative and needs to be prefixed
                // }));
            },
            error: (error) => {
                console.error('Error loading last photos:', error);
            }
        });
    }

    loadPhotos(): void {
        const params = {
            page: 1,
            size: 10,
            tournament: this.selectedTournament ? this.selectedTournament : undefined,
            // teams: this.selectedTour ? [this.selectedTour] : [],
            tour: this.selectedTour ? this.selectedTour : undefined
        };

        this.galleryService.getPhotos(params).subscribe({
            next: (response) => {
                this.photos = response.data;

                //временная заглушка для тестирования
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


    onTournamentChange(tournamentId: string): void {
        this.selectedTournament = tournamentId;
        this.loadTours();
        this.loadPhotos();
    }

    onTourChange(tourId: string): void {
        this.selectedTour = tourId;
        this.loadPhotos();
    }
}
