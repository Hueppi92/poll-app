import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SurveyService } from '../service/survey-service';
import { NumerationPipe } from '../../pipes/numeration.pipe';

interface DraftAnswer {
  id: number;
  text: string;
}

interface DraftQuestion {
  id: number;
  text: string;
  allowMultiple: boolean;
  answers: DraftAnswer[];
}

let nextDraftId = 0;
const createDraftId = () => ++nextDraftId;

function createEmptyAnswer(): DraftAnswer {
  return { id: createDraftId(), text: '' };
}

function createEmptyQuestion(): DraftQuestion {
  return {
    id: createDraftId(),
    text: '',
    allowMultiple: false,
    answers: [createEmptyAnswer(), createEmptyAnswer()],
  };
}

@Component({
  selector: 'app-new-survey',
  imports: [NumerationPipe],
  templateUrl: './new-survey.html',
  styleUrl: './new-survey.scss',
})
export class NewSurvey implements OnInit {
  private surveyService = inject(SurveyService);
  private router = inject(Router);

  title = signal('');
  description = signal('');
  endDate = signal('');
  category = signal('');
  categories = signal<string[]>([]);
  questions = signal<DraftQuestion[]>([createEmptyQuestion()]);
  isPublishing = signal(false);

  canPublish = computed(() => {
    if (!this.title().trim() || this.isPublishing()) {
      return false;
    }

    return this.questions().every(
      (question) =>
        question.text.trim().length > 0 &&
        question.answers.filter((answer) => answer.text.trim().length > 0).length >= 2,
    );
  });

  async ngOnInit() {
    this.categories.set(await this.surveyService.getCategories());
  }

  onTitleChange(event: Event): void {
    this.title.set((event.target as HTMLInputElement).value);
  }

  onDescriptionChange(event: Event): void {
    this.description.set((event.target as HTMLTextAreaElement).value);
  }

  onEndDateChange(event: Event): void {
    this.endDate.set((event.target as HTMLInputElement).value);
  }

  onCategoryChange(event: Event): void {
    this.category.set((event.target as HTMLSelectElement).value);
  }

  clearTitle(): void {
    this.title.set('');
  }

  clearDescription(): void {
    this.description.set('');
  }

  clearEndDate(): void {
    this.endDate.set('');
  }

  addQuestion(): void {
    this.questions.update((questions) => [...questions, createEmptyQuestion()]);
  }

  removeQuestion(questionId: number): void {
    this.questions.update((questions) => questions.filter((question) => question.id !== questionId));
  }

  onQuestionTextChange(questionId: number, event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.updateQuestion(questionId, (question) => ({ ...question, text }));
  }

  toggleAllowMultiple(questionId: number, event: Event): void {
    const allowMultiple = (event.target as HTMLInputElement).checked;
    this.updateQuestion(questionId, (question) => ({ ...question, allowMultiple }));
  }

  addAnswer(questionId: number): void {
    this.updateQuestion(questionId, (question) => ({
      ...question,
      answers: [...question.answers, createEmptyAnswer()],
    }));
  }

  removeAnswer(questionId: number, answerId: number): void {
    this.updateQuestion(questionId, (question) => ({
      ...question,
      answers: question.answers.filter((answer) => answer.id !== answerId),
    }));
  }

  onAnswerTextChange(questionId: number, answerId: number, event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.updateQuestion(questionId, (question) => ({
      ...question,
      answers: question.answers.map((answer) =>
        answer.id === answerId ? { ...answer, text } : answer,
      ),
    }));
  }

  private updateQuestion(
    questionId: number,
    updater: (question: DraftQuestion) => DraftQuestion,
  ): void {
    this.questions.update((questions) =>
      questions.map((question) => (question.id === questionId ? updater(question) : question)),
    );
  }

  cancel(): void {
    this.router.navigateByUrl('/');
  }

  async publish(): Promise<void> {
    if (!this.canPublish()) {
      return;
    }

    this.isPublishing.set(true);
    try {
      const survey = await this.surveyService.createSurvey({
        title: this.title().trim(),
        description: this.description().trim(),
        category: this.category().trim(),
        ends_at: this.endDate() || null,
      });

      for (const question of this.questions()) {
        const answers = question.answers.filter((answer) => answer.text.trim().length > 0);
        const createdQuestion = await this.surveyService.createQuestion({
          survey_id: survey.id,
          question_text: question.text.trim(),
          answer_count: answers.length,
          allow_multiple: question.allowMultiple,
        });

        await Promise.all(
          answers.map((answer) =>
            this.surveyService.createAnswer({
              question_id_survey_id: createdQuestion.id,
              answer_text: answer.text.trim(),
              this_answer_count: 0,
            }),
          ),
        );
      }

      await this.router.navigate(['/survey', survey.id]);
    } finally {
      this.isPublishing.set(false);
    }
  }
}
