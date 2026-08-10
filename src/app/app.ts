import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { SurveyService } from './components/service/survey-service';
import type { SurveyPreview } from './components/interfaces/survey';
import { PreviewCardComponent } from './components/preview-card/preview-card';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Hero, PreviewCardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('poll-app');
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
      const previews = await this.surveyService.getAllSurveys();
      this.previews.set(previews);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load surveys';
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }
}   