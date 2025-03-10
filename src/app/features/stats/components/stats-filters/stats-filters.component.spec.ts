import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsFiltersComponent } from './stats-filters.component';

describe('StatsFiltersComponent', () => {
  let component: StatsFiltersComponent;
  let fixture: ComponentFixture<StatsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsFiltersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
