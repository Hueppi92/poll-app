import { Component, inject } from '@angular/core';
import { SurveyService } from '../service/survey-service';



@Component({
  selector: 'app-survey',
  imports: [],
  templateUrl: './survey.html',
  styleUrl: './survey.scss',
})
export class Survey {
  private surveyService = inject(SurveyService);
      

}
