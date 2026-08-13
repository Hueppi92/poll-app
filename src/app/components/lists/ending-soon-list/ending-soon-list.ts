import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SurveyService } from '../../service/survey-service';
import type { Survey } from '../../interfaces/survey';
import { SurveySnippet } from '../../survey-snippet/survey-snippet';


@Component({
  selector: 'app-ending-soon-list',
  imports: [SurveySnippet],
  templateUrl: './ending-soon-list.html',
  styleUrls: ['./ending-soon-list.scss', '../../survey-snippet/survey-snippet.scss'] ,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndingSoonList {

  surveys = signal<Survey[]>([]);
  private surveyService = inject(SurveyService);

  async ngOnInit(): Promise<void> {
    
    this.surveys.set(await this.surveyService.getEndingSoonSurveys());
  }
}
