import { Component, inject, input, OnInit, signal } from '@angular/core';
import { SurveyService } from '../service/survey-service';
import type { Answer, Question as QuestionModel } from '../interfaces/survey';
import { AnswerClass } from '../answer/answer';
import { NumerationPipe } from '../../pipes/numeration.pipe';

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
  answers = signal<Answer[]>([]);

  async ngOnInit() {
    const answers = await this.surveyService.getAnswersByQuestionId(this.question().id);
    this.answers.set(answers);
  }
}
