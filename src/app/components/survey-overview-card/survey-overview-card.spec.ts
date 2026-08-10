import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyOverviewCard } from './survey-overview-card';

describe('SurveyOverviewCard', () => {
  let component: SurveyOverviewCard;
  let fixture: ComponentFixture<SurveyOverviewCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyOverviewCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyOverviewCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
