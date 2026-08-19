import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Hero } from '../hero/hero';
import { EndingSoonList } from '../lists/ending-soon-list/ending-soon-list';
import { SurveyList } from '../lists/survey-list/survey-list';

@Component({
  selector: 'app-home',
  imports: [Hero, EndingSoonList, SurveyList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Home {}
