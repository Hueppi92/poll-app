import { Component } from '@angular/core';
import { SurveyService } from '../service/survey-service';
import type { SurveyPreview } from '../interfaces/survey';
import { signal } from '@angular/core';
import { inject } from '@angular/core';
import { PreviewCardComponent } from '../preview-card/preview-card';

@Component({
  selector: 'app-preview-container',
  imports: [PreviewCardComponent],
  templateUrl: './preview-container.html',
  styleUrl: './preview-container.scss',
})
export class PreviewContainerComponent {

  private surveyService = inject(SurveyService);

  previews = signal<SurveyPreview[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    void this.loadPreviews();
  }

  private async loadPreviews(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const previews = await this.surveyService.getAllSurveyPreviews();
      this.previews.set(previews);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load surveys';
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }
}
