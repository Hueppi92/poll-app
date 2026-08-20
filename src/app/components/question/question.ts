import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { SurveyService } from '../service/survey-service';
import type { Answer, Question as QuestionModel } from '../interfaces/survey';
import { AnswerClass, type AnswerToggled } from '../answer/answer';
import { NumerationPipe } from '../../pipes/numeration.pipe';

export interface QuestionAnswerToggled extends AnswerToggled {
  questionId: number;
  allowMultiple: boolean;
  // every answer id under this question, used to clear the others on single-select
  questionAnswerIds: number[];
}

@Component({
  selector: 'app-question',
  imports: [AnswerClass, NumerationPipe],
  templateUrl: './question.html',
  styleUrl: './question.scss',
})
export class Question implements OnInit {
  private surveyService = inject(SurveyService);
  question = input.required<QuestionModel>();
  index = input.required<number>();
  selectedAnswerIds = input<ReadonlySet<number>>(new Set());
  disabled = input(false);
  answers = signal<Answer[]>([]);
  answerToggled = output<QuestionAnswerToggled>();

  async ngOnInit() {
    const answers = await this.surveyService.getAnswersByQuestionId(this.question().id);
    this.answers.set(answers);
  }

  onAnswerToggled(event: AnswerToggled): void {
    this.answerToggled.emit({
      ...event,
      questionId: this.question().id,
      allowMultiple: this.question().allow_multiple,
      questionAnswerIds: this.answers().map((answer) => answer.id),
    });
  }
}
