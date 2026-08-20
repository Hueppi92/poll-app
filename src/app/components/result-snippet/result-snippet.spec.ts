import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSnippet } from './result-snippet';

describe('ResultSnippet', () => {
  let component: ResultSnippet;
  let fixture: ComponentFixture<ResultSnippet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultSnippet],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultSnippet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
