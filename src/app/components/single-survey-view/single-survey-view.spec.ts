import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSurveyView } from './single-survey-view';

describe('SingleSurveyView', () => {
  let component: SingleSurveyView;
  let fixture: ComponentFixture<SingleSurveyView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleSurveyView],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleSurveyView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
