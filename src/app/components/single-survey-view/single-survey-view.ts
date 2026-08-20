import { Component, computed, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../service/survey-service';
import { Question } from '../question/question';
import { ResultSnippet } from '../result-snippet/result-snippet';
import type { Survey, Question as QuestionModel } from '../interfaces/survey';
import type { QuestionAnswerToggled } from '../question/question';

const RESET_DELAY_MS = 4000;

@Component({
  selector: 'app-single-survey-view',
  imports: [Question, ResultSnippet],
  templateUrl: './single-survey-view.html',
  styleUrl: './single-survey-view.scss',
})
export class SingleSurveyView implements OnInit, OnDestroy {
  private surveyService = inject(SurveyService);
  private route = inject(ActivatedRoute);
  private resultSnippet = viewChild(ResultSnippet);
  private resetTimeout?: ReturnType<typeof setTimeout>;

  survey = signal<Survey | null>(null);
  questions = signal<QuestionModel[]>([]);
  // answer ids checked by the user that haven't been saved yet
  pendingSelections = signal<ReadonlySet<number>>(new Set());
  // becomes true once votes are persisted, locking the form against repeat submissions
  submitted = signal(false);
  // shows the "Survey completed" toast until the form resets
  showToast = signal(false);
  // stable empty set reference used to stop the live preview once votes are already saved
  readonly emptySelections: ReadonlySet<number> = new Set();

  isExpired = computed(() => {
    const survey = this.survey();
    return survey ? new Date(survey.ends_at) < new Date() : false;
  });

  async ngOnInit() {
    const surveyId = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isNaN(surveyId)) {
      return;
    }

    const survey = await this.surveyService.getSurveyById(surveyId);
    this.survey.set(survey);

    const questions = await this.surveyService.getQuestionsBySurveyId(surveyId);
    this.questions.set(questions);
  }

  ngOnDestroy() {
    clearTimeout(this.resetTimeout);
  }

  onAnswerToggled({ answerId, checked, allowMultiple, questionAnswerIds }: QuestionAnswerToggled): void {
    if (this.submitted()) {
      return;
    }

    const selections = new Set(this.pendingSelections());
    if (checked && !allowMultiple) {
      // single-select question: clear any other answer already picked for it
      for (const id of questionAnswerIds) {
        selections.delete(id);
      }
    }
    checked ? selections.add(answerId) : selections.delete(answerId);
    this.pendingSelections.set(selections);
  }

  async submitSurvey(): Promise<void> {
    const selections = this.pendingSelections();
    if (this.submitted() || selections.size === 0) {
      return;
    }

    await Promise.all(
      [...selections].map((answerId) => this.surveyService.changeAnswerCount(answerId, true)),
    );
    await this.surveyService.incrementDoneCount(this.survey()!.id);

    this.submitted.set(true);
    this.showToast.set(true);
    await this.resultSnippet()?.reload();

    clearTimeout(this.resetTimeout);
    this.resetTimeout = setTimeout(() => this.resetSurvey(), RESET_DELAY_MS);
  }

  // clears the local vote so the survey can be answered again
  private resetSurvey(): void {
    this.showToast.set(false);
    this.submitted.set(false);
    this.pendingSelections.set(new Set());
  }
}
