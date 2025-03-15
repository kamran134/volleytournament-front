import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEditingDialogComponent } from './student-editing-dialog.component';

describe('StudentEditingComponent', () => {
  let component: StudentEditingDialogComponent;
  let fixture: ComponentFixture<StudentEditingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentEditingDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentEditingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
