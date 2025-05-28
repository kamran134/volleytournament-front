import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsColumnsComponent } from './stats-columns.component';

describe('StatsColumnsComponent', () => {
  let component: StatsColumnsComponent;
  let fixture: ComponentFixture<StatsColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsColumnsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatsColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
