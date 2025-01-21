import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamAddDialogComponent } from './exam-add-dialog.component';

describe('ExamAddDialogComponent', () => {
  let component: ExamAddDialogComponent;
  let fixture: ComponentFixture<ExamAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamAddDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExamAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
