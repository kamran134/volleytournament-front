import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamResultsListComponent } from './exam-results-list.component';

describe('ExamResultsListComponent', () => {
  let component: ExamResultsListComponent;
  let fixture: ComponentFixture<ExamResultsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamResultsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExamResultsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
