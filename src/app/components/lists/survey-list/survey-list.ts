import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

import { SurveyService } from '../../service/survey-service';
import type { Survey } from '../../interfaces/survey';
import { SurveySnippet } from '../../survey-snippet/survey-snippet';

@Component({
  selector: 'app-survey-list',
  imports: [SurveySnippet],
  templateUrl: './survey-list.html',
  styleUrls: ['./survey-list.scss', '../../survey-snippet/survey-snippet.scss'] ,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyList {
  private surveyService = inject(SurveyService);
  protected surveys = signal<Survey[]>([]);

  async ngOnInit() {
    const surveys = await this.surveyService.getAllSurvey();
    this.surveys.set(surveys);
  }

}