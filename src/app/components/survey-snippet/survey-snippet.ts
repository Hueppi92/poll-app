import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Survey } from '../interfaces/survey';

@Component({
  selector: 'app-survey-snippet',
  imports: [RouterLink],
  templateUrl: './survey-snippet.html',
  styleUrl: './survey-snippet.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveySnippet {
  survey = input.required<Survey>();
  variant = input<'all' | 'ending-soon'>('all');

  remainingDays = computed(() => {
    const endDate = new Date(`${this.survey().ends_at}T00:00:00`);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    return Math.max(
      0,
      Math.ceil((endDate.getTime() - today.getTime()) / millisecondsPerDay),
    );
  });
}