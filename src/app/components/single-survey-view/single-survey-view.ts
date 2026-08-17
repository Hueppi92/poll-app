import { Component, inject } from '@angular/core';
import { SurveyService } from '../service/survey-service';

@Component({
  selector: 'app-single-survey-view',
  imports: [],
  templateUrl: './single-survey-view.html',
  styleUrl: './single-survey-view.scss',
})
export class SingleSurveyView {
  private surveyService = inject(SurveyService);

  constructor() {
   reateSingleSurveyViewOfID(surveyId: number) {
      await this.surveyService.getSurveyById(surveyId);

    }

    async createSingleSurveyViewOfID(surveyId: number) {
      const survey = await this.surveyService.getSurveyById(surveyId);
      if (!survey) {
        throw new Error(`Survey with ID ${surveyId} not found.`);
      }
      return survey;
    }
  }
}
