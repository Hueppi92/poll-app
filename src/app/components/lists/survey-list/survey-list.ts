import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';

import { SurveyService } from '../../service/survey-service';
import type { Survey } from '../../interfaces/survey';
import { SurveySnippet } from '../../survey-snippet/survey-snippet';

type SurveyStatus = 'active' | 'past';

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
  protected selectedStatus = signal<SurveyStatus>('active');
  private surveyService = inject(SurveyService);
  protected surveys = signal<Survey[]>([]);
  protected filteredSurveys = computed(() => {
    const status = this.selectedStatus();
    const category = this.selectedCategory();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.surveys().filter((survey) => {
      const endDate = new Date(`${survey.ends_at}T00:00:00`);
      const surveyStatus = endDate >= today ? 'active' : 'past';
      const matchesStatus = surveyStatus === status;
      const matchesCategory = category === 'all' || survey.category === category;

      return matchesStatus && matchesCategory;
    });
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

  protected onStatusChange(status: SurveyStatus): void {
    this.selectedStatus.set(status);
  }

}