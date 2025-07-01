import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentEditDialogComponent } from './tournament-edit-dialog.component';

describe('TournamentEditDialogComponent', () => {
  let component: TournamentEditDialogComponent;
  let fixture: ComponentFixture<TournamentEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournamentEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TournamentEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
