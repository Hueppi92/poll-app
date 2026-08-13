import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveySnippet } from './survey-snippet';

describe('SurveySnippet', () => {
  let component: SurveySnippet;
  let fixture: ComponentFixture<SurveySnippet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveySnippet],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveySnippet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
