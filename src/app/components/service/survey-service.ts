import { Injectable, inject } from '@angular/core';
import { DbService } from './db-service';
import type { Survey, Question, Answer, Question as QuestionModel } from '../interfaces/survey';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private dbService = inject(DbService);

async getAllSurvey(): Promise<Survey[]> {
    const { data, error } = await this.dbService.supabase
      .from('survey')
      .select('id, category, description, title, ends_at, done_count')
      .order('ends_at', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
    console.log(data);
    return (data ?? []) as Survey[];
  }

  async getActiveSurvey(): Promise<Survey[]> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await this.dbService.supabase
      .from('survey')
      .select('id, category, description, title, ends_at, done_count')
      .gte('ends_at', today)
      .order('ends_at', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
   console.log(data);
    return (data ?? []) as Survey[];
  }

  async getPastSurvey(): Promise<Survey[]> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await this.dbService.supabase
      .from('survey')
      .select('id, category, description, title, ends_at, done_count')
      .lt('ends_at', today)
      .order('ends_at', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
   console.log(data);
    return (data ?? []) as Survey[];
  }

  async getSurveyById(surveyId: number): Promise<Survey | null> {
    const { data, error } = await this.dbService.supabase
      .from('survey')
      .select('id, category, description, title, ends_at, done_count')
      .eq('id', surveyId)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    console.log(data);
    return (data ?? null) as Survey | null;
  }

  async getQuestionsBySurveyId(surveyId: number): Promise<Question[]> {
    const { data, error } = await this.dbService.supabase
      .from('questions')
      .select('id, survey_id, answer_count, question_text, allow_multiple')
      .eq('survey_id', surveyId)
      .order('id', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
    console.log(data);
    return (data ?? []) as Question[];  
}

  async getAnswersByQuestionId(questionId: number): Promise<Answer[]> {
    const { data, error } = await this.dbService.supabase
      .from('answers')
      .select('id, question_id_survey_id, answer_text, this_answer_count')
      .eq('question_id_survey_id', questionId)
      .order('id', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
    console.log(data);
    return (data ?? []) as Answer[];
  }

  async getEndingSoonSurveys(): Promise<Survey[]> {
  const today = new Date();
  const in5Days = new Date();
  in5Days.setDate(today.getDate() + 5);

  const todayStr = today.toISOString().split('T')[0];
  const in5DaysStr = in5Days.toISOString().split('T')[0];

  const { data, error } = await this.dbService.supabase
    .from('survey')
    .select('id, category, description, title, ends_at, done_count')
    .gte('ends_at', todayStr)
    .lte('ends_at', in5DaysStr)
    .order('ends_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  console.log(data);
  return (data ?? []) as Survey[];
}

async getCategories(): Promise<string[]> {
  const { data, error } = await this.dbService.supabase
    .from('survey')
    .select('category');

  if (error) {
    throw new Error(error.message);
  }

  return [
    ...new Set(
      (data ?? [])
        .map((item: { category: string }) => item.category.trim())
        .filter(Boolean)
    ),
  ].sort();
}

async getFullSurveyData(surveyId: number): Promise<{ survey: Survey; questions: Question[]; answers: Answer[] }> {
  const survey = await this.getSurveyById(surveyId);
  if (!survey) {
    throw new Error(`Survey with ID ${surveyId} not found`);
  }
  const questions = await this.getQuestionsBySurveyId(surveyId);
  const answers = await Promise.all(questions.map(q => this.getAnswersByQuestionId(q.id)));
  return { survey, questions, answers: answers.flat() };
}

async incrementDoneCount(surveyId: number): Promise<void> {
  const { data, error } = await this.dbService.supabase
    .from('survey')
    .select('done_count')
    .eq('id', surveyId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const { error: updateError } = await this.dbService.supabase
    .from('survey')
    .update({ done_count: (data?.done_count ?? 0) + 1 })
    .eq('id', surveyId);

  if (updateError) {
    throw new Error(updateError.message);
  }
}

async createSurvey(survey: {
  title: string;
  description: string;
  category: string;
  ends_at: string | null;
}): Promise<Survey> {
  const { data, error } = await this.dbService.supabase
    .from('survey')
    .insert({ ...survey, done_count: 0 })
    .select('id, category, description, title, ends_at, done_count')
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as Survey;
}

async createQuestion(question: {
  survey_id: number;
  question_text: string;
  answer_count: number;
  allow_multiple: boolean;
}): Promise<Question> {
  const { data, error } = await this.dbService.supabase
    .from('questions')
    .insert(question)
    .select('id, survey_id, answer_count, question_text, allow_multiple')
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as Question;
}

async createAnswer(answer: {
  question_id_survey_id: number;
  answer_text: string;
  this_answer_count: number;
}): Promise<Answer> {
  const { data, error } = await this.dbService.supabase
    .from('answers')
    .insert(answer)
    .select('id, question_id_survey_id, answer_text, this_answer_count')
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as Answer;
}



async changeAnswerCount(answerId: number, checked: boolean): Promise<void> {
  const { data, error } = await this.dbService.supabase
    .from('answers')
    .select('this_answer_count')
    .eq('id', answerId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const currentCount = data?.this_answer_count ?? 0;
  const newCount = checked ? currentCount + 1 : currentCount - 1;
  const { error: updateError } = await this.dbService.supabase
    .from('answers')
    .update({ this_answer_count: newCount })
    .eq('id', answerId);

  if (updateError) {
    throw new Error(updateError.message);
  }
} 

}