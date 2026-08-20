import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { SurveyService } from '../service/survey-service';
import { DbService } from '../service/db-service';
import type { Survey, Question as QuestionModel, Answer } from '../interfaces/survey';
import { NumerationPipe } from '../../pipes/numeration.pipe';

interface AnswerResult extends Answer {
  percent: number;
}

interface QuestionResult {
  question: QuestionModel;
  answers: AnswerResult[];
}

@Component({
  selector: 'app-result-snippet',
  imports: [NumerationPipe],
  templateUrl: './result-snippet.html',
  styleUrl: './result-snippet.scss',
})
export class ResultSnippet implements OnInit, OnDestroy {
  private surveyService = inject(SurveyService);
  private dbService = inject(DbService);
  private channel?: RealtimeChannel;

  survey = input.required<Survey>();
  // answer ids the user has selected but not submitted yet, used to preview results live
  pendingSelections = input<ReadonlySet<number>>(new Set());
  results = signal<QuestionResult[]>([]);

  // combines the last saved results with the not-yet-submitted selections
  liveResults = computed<QuestionResult[]>(() => {
    const pending = this.pendingSelections();
    return this.results().map(({ question, answers }) => {
      const counts = answers.map(
        (answer) => answer.this_answer_count + (pending.has(answer.id) ? 1 : 0),
      );
      const total = counts.reduce((sum, count) => sum + count, 0);
      return {
        question,
        answers: answers.map((answer, i) => ({
          ...answer,
          percent: total > 0 ? Math.round((counts[i] / total) * 100) : 0,
        })),
      };
    });
  });

  // whether there's anything to show yet, including a not-yet-submitted live preview
  hasResults = computed<boolean>(() =>
    this.liveResults().some((row) => row.answers.some((answer) => answer.this_answer_count > 0)),
  );

  async ngOnInit() {
    await this.reload();
    this.subscribeToLiveUpdates();
  }

  ngOnDestroy() {
    if (this.channel) {
      this.dbService.supabase.removeChannel(this.channel);
    }
  }

  // listens for votes saved by any client (this tab, other tabs, other users) and refreshes
  private subscribeToLiveUpdates(): void {
    this.channel = this.dbService.supabase
      .channel(`survey-results-${this.survey().id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'answers' },
        () => {
          void this.reload();
        },
      )
      .subscribe();
  }

  // re-fetches the persisted results, dropping any local preview state
  async reload(): Promise<void> {
    const questions = await this.surveyService.getQuestionsBySurveyId(this.survey().id);
    const results = await Promise.all(
      questions.map(async (question) => {
        const answers = await this.surveyService.getAnswersByQuestionId(question.id);
        const total = answers.reduce((sum, answer) => sum + answer.this_answer_count, 0);
        return {
          question,
          answers: answers.map((answer) => ({
            ...answer,
            percent: total > 0 ? Math.round((answer.this_answer_count / total) * 100) : 0,
          })),
        };
      })
    );
    this.results.set(results);
  }
}
