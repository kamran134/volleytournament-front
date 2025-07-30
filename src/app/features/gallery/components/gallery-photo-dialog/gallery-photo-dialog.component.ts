import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Photo } from '../../../../core/models/photo.model';
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: 'app-gallery-photo-dialog',
    standalone: true,
    imports: [
        // Add any necessary imports here, such as Angular Material modules
        // MatDialogModule, MatButtonModule, etc.
        MatDialogModule,
        MatButtonModule,
        MatIcon
    ],
    templateUrl: './gallery-photo-dialog.component.html',
    styleUrl: './gallery-photo-dialog.component.scss'
})
export class GalleryPhotoDialogComponent implements OnInit {
    photo: Photo | null = null;

    constructor(
        private dialogRef: MatDialogRef<GalleryPhotoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dataSource: Photo,
    ) { }

    ngOnInit(): void {
        // Initialize the dialog with the photo data
        this.photo = this.dataSource;
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    downloadImage(): void {
        if (!this.photo) return;

        // Загружаем webp как Blob
        fetch(this.photo.url)
            .then(res => res.blob())
            .then(blob => {
                // Создаём объект Image и читаем blob как URL
                const img = new Image();
                img.crossOrigin = 'anonymous'; // важно для скачивания с другого домена
                img.src = URL.createObjectURL(blob);

                img.onload = () => {
                    // Рисуем в canvas
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;

                    ctx.drawImage(img, 0, 0);

                    // Преобразуем в JPEG
                    canvas.toBlob((jpegBlob) => {
                        if (!jpegBlob) return;

                        // Создаём ссылку для скачивания
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(jpegBlob);
                        link.download = (this.photo?.description || 'image') + '.jpg';
                        link.click();

                        // Чистим память
                        URL.revokeObjectURL(link.href);
                    }, 'image/jpeg', 0.9); // 0.9 = качество
                };
            })
            .catch(err => console.error('Ошибка при загрузке изображения:', err));
    }

}
