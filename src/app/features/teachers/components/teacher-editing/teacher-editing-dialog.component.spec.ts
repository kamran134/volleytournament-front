import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherEditingDialogComponent } from './teacher-editing-dialog.component';

describe('TeacherEditingDialogComponent', () => {
  let component: TeacherEditingDialogComponent;
  let fixture: ComponentFixture<TeacherEditingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherEditingDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherEditingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
