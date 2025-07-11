import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTournamentsComponent } from './home-tournaments.component';

describe('HomeTournamentsComponent', () => {
  let component: HomeTournamentsComponent;
  let fixture: ComponentFixture<HomeTournamentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeTournamentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeTournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
