import { Component, inject  } from '@angular/core';

import { SurveyService } from '../service/survey-service';

@Component({
  selector: 'app-survey-list',
  imports: [],
  templateUrl: './survey-list.html',
  styleUrl: './survey-list.scss',
})
export class SurveyList {
  private surveyService = inject(SurveyService);

  constructor() {
    /* this.surveyService.getAllSurvey(); */
    this.surveyService.getQuestionsBySurveyId(1);
    this.surveyService.getQuestionsBySurveyId(2);
    this.surveyService.getAnswersByQuestionId(1);
    this.surveyService.getAnswersByQuestionId(4);
    
}
}