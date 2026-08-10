import { Injectable, inject } from '@angular/core';
import { DbService } from './db-service';
import type { SurveyPreview } from '../interfaces/survey';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private dbService = inject(DbService);

  async getAllSurveys(): Promise<SurveyPreview[]> {
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

    return (data ?? []) as SurveyPreview[];
  }
}
