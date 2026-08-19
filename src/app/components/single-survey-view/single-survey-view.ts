import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../service/survey-service';
import { Question } from '../question/question';
import type { Survey, Question as QuestionModel } from '../interfaces/survey';

@Component({
  selector: 'app-single-survey-view',
  imports: [Question],
  templateUrl: './single-survey-view.html',
  styleUrl: './single-survey-view.scss',
})
export class SingleSurveyView implements OnInit {
  private surveyService = inject(SurveyService);
  private route = inject(ActivatedRoute);

  survey = signal<Survey | null>(null);
  questions = signal<QuestionModel[]>([]);

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

  submitSurvey(): void {
  }
}
