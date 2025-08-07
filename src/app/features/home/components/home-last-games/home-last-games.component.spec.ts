import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLastGamesComponent } from './home-last-games.component';

describe('HomeLastGamesComponent', () => {
  let component: HomeLastGamesComponent;
  let fixture: ComponentFixture<HomeLastGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeLastGamesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeLastGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
