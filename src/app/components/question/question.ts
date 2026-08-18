import { Component, inject, input, OnInit, signal } from '@angular/core';
import { SurveyService } from '../service/survey-service';
import type { Answer, Question as QuestionModel } from '../interfaces/survey';
import { AnswerClass } from '../answer/answer';

@Component({
  selector: 'app-question',
  imports: [AnswerClass],
  templateUrl: './question.html',
  styleUrl: './question.scss',
})
export class Question implements OnInit {
  private surveyService = inject(SurveyService);
  question = input.required<QuestionModel>();
  answers = signal<Answer[]>([]);

  async ngOnInit() {
    const answers = await this.surveyService.getAnswersByQuestionId(this.question().id);
    this.answers.set(answers);
  }
}
