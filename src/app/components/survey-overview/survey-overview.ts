import { Component } from '@angular/core';
import { SurveyOverviewCard } from '../survey-overview-card/survey-overview-card';


@Component({
  selector: 'app-survey-overview',
  imports: [SurveyOverviewCard],
  templateUrl: './survey-overview.html',
  styleUrl: './survey-overview.scss',
})
export class SurveyOverview {}
