import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentMainComponent } from './tournament-main.component';

describe('TournamentMainComponent', () => {
  let component: TournamentMainComponent;
  let fixture: ComponentFixture<TournamentMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournamentMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TournamentMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
