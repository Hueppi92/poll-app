import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';

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
export class SurveyList implements OnInit {
  protected categories = signal<string[]>([]);
  protected selectedCategory = signal('all');
  private surveyService = inject(SurveyService);
  protected surveys = signal<Survey[]>([]);
  protected filteredSurveys = computed(() => {
    const category = this.selectedCategory();

    return category === 'all'
      ? this.surveys()
      : this.surveys().filter((survey) => survey.category === category);
  });

  async ngOnInit() {
    const surveys = await this.surveyService.getAllSurvey();
    this.surveys.set(surveys);
    this.categories.set(await this.surveyService.getCategories());
  }

  protected onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory.set(select.value);
  }

}