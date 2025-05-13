import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';

interface Column {
    key: string;
    label: string;
    selected: boolean;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatTabsModule,
        CommonModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    theme: boolean = false; // false = light, true = dark
    //studentColumns: string = '';
    monthStudentColumnOptions: Column[] = [
        { key: 'code', label: 'Kodu', selected: false },
        { key: 'lastName', label: 'Soyadı', selected: false },
        { key: 'firstName', label: 'Adı', selected: false },
        { key: 'middleName', label: 'Ata adı', selected: false },
        { key: 'grade', label: 'Sinifi', selected: false },
        { key: 'teacher', label: 'Müəllimi', selected: false },
        { key: 'school', label: 'Məktəbi', selected: false },
        { key: 'district', label: 'Rayonu', selected: false },
        { key: 'score', label: 'Balı', selected: false },
        { key: 'status', label: 'Statusu', selected: false },
    ];

    studentColumnOptions: Column[] = [
        { key: 'code', label: 'Kodu', selected: false },
        { key: 'lastName', label: 'Soyadı', selected: false },
        { key: 'firstName', label: 'Adı', selected: false },
        { key: 'middleName', label: 'Ata adı', selected: false },
        { key: 'grade', label: 'Sinifi', selected: false },
        { key: 'teacher', label: 'Müəllimi', selected: false },
        { key: 'school', label: 'Məktəbi', selected: false },
        { key: 'district', label: 'Rayonu', selected: false },
        { key: 'score', label: 'Balı', selected: false },
        { key: 'averageScore', label: 'Orta balı', selected: false },
        { key: 'status', label: 'Statusu', selected: false },
    ];

    teacherColumnOptions: Column[] = [
        { key: 'code', label: 'Kodu', selected: false },
        { key: 'fullname', label: 'Soyadı, adı, ata adı', selected: false },
        { key: 'school', label: 'Məktəbi', selected: false },
        { key: 'district', label: 'Rayonu', selected: false },
        { key: 'score', label: 'Balı', selected: false },
        { key: 'averageScore', label: 'Orta balı', selected: false }
    ];

    schoolColumnOptions: Column[] = [
        { key: 'code', label: 'Kodu', selected: false },
        { key: 'name', label: 'Adı', selected: false },
        { key: 'district', label: 'Rayonu', selected: false },
        { key: 'score', label: 'Balı', selected: false },
        { key: 'averageScore', label: 'Orta balı', selected: false }
    ];

    districtColumnOptions: Column[] = [
        { key: 'code', label: 'Kodu', selected: false },
        { key: 'name', label: 'Adı', selected: false },
        { key: 'score', label: 'Balı', selected: false },
        { key: 'averageScore', label: 'Orta balı', selected: false }
    ];

    schoolColumns: string = '';
    teacherColumns: string = '';
    showSettings: boolean = false;

    STORAGE_KEY: string = 'dashboard-settings';
    STORAGE_KEY_THEME: string = 'theme';
    STORAGE_KEY_MONTH_STUDENT_COLUMNS: string = 'month-student-columns';
    STORAGE_KEY_DISTRICT_COLUMNS: string = 'district-columns';
    STORAGE_KEY_STUDENT_COLUMNS: string = 'student-columns';
    STORAGE_KEY_SCHOOL_COLUMNS: string = 'school-columns';
    STORAGE_KEY_TEACHER_COLUMNS: string = 'teacher-columns';

    ngOnInit() {
        this.loadSettings();
    }

    saveSettings() {
        const settings = {
            theme: this.theme,
            monthStudentColumns: this.monthStudentColumnOptions
                .filter((col) => col.selected)
                .map((col) => col.key)
                .join(','),
            studentColumns: this.studentColumnOptions
                .filter((col) => col.selected)
                .map((col) => col.key)
                .join(','),
            schoolColumns: this.schoolColumnOptions
                .filter((col) => col.selected)
                .map((col) => col.key)
                .join(','),
            teacherColumns: this.teacherColumnOptions
                .filter((col) => col.selected)
                .map((col) => col.key)
                .join(','),
            districtColumns: this.districtColumnOptions
                .filter((col) => col.selected)
                .map((col) => col.key)
                .join(',')
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
      }
    
    loadSettings() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            const settings = JSON.parse(saved);
            this.theme = settings.theme ?? false;

            if (settings.monthStudentColumns) {
                const selectedKeys = settings.monthStudentColumns.split(',');
                this.monthStudentColumnOptions.forEach((col) => {
                  col.selected = selectedKeys.includes(col.key);
                });
            }

            if (settings.studentColumns) {
                const selectedKeys = settings.studentColumns.split(',');
                this.studentColumnOptions.forEach((col) => {
                  col.selected = selectedKeys.includes(col.key);
                });
            }

            if (settings.schoolColumns) {
                const selectedKeys = settings.schoolColumns.split(',');
                this.schoolColumnOptions.forEach((col) => {
                  col.selected = selectedKeys.includes(col.key);
                });
            }

            if (settings.teacherColumns) {
                const selectedKeys = settings.teacherColumns.split(',');
                this.teacherColumnOptions.forEach((col) => {
                  col.selected = selectedKeys.includes(col.key);
                });
            }

            if (settings.districtColumns) {
                const selectedKeys = settings.districtColumns.split(',');
                this.districtColumnOptions.forEach((col) => {
                  col.selected = selectedKeys.includes(col.key);
                });
            }
        }
    }

    getSelectedColumns(columns: Column[]): string {
        return columns
            .filter((col) => col.selected)
            .map((col) => col.key)
            .join(', ') || '';
    }
}
