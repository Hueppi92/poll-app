import { Injectable, inject } from '@angular/core';
import { DbService } from './db-service';
import type { Survey, Question } from '../interfaces/survey';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private dbService = inject(DbService);

  async getAllSurvey(): Promise<Survey[]> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await this.dbService.supabase
      .from('survey')
      .select('id, category, description, name, is_active, ends_at')
      .eq('is_active', true)
      .gt('ends_at', today)
      .order('ends_at', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
   console.log(data);
    return (data ?? []) as Survey[];
  }

  async getQuestionsBySurveyId(surveyId: number): Promise<Question[]> {
    const { data, error } = await this.dbService.supabase
      .from('questions')
      .select('id, survey_id, answer_count, question_text')
      .eq('survey_id', surveyId);

    if (error) {
      throw new Error(error.message);
    }
    console.log(data);
    return (data ?? []) as Question[];  
}
}