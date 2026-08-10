import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { SurveyPreview } from '../interfaces/survey';

@Component({
  selector: 'app-preview-card',
  imports: [],
  templateUrl: './preview-card.html',
  styleUrl: './preview-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewCardComponent {
  preview = input.required<SurveyPreview>();

  readonly remainingDaysLabel = computed(() => {
    const days = this.getRemainingDays(this.preview().ends_at);

    if (days <= 0) {
      return 'Ends today';
    }

    if (days === 1) {
      return '1 day left';
    }

    return `${days} days left`;
  });

  private getRemainingDays(endDate: string): number {
    const [yearText, monthText, dayText] = endDate.split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);

    if (!year || !month || !day) {
      return 0;
    }

    const end = new Date(year, month - 1, day);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msPerDay = 24 * 60 * 60 * 1000;

    return Math.max(0, Math.ceil((end.getTime() - today.getTime()) / msPerDay));
  }
}
