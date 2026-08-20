import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { SingleSurveyView } from './components/single-survey-view/single-survey-view';
import { NewSurvey } from './components/new-survey/new-survey';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'survey/new', component: NewSurvey },
  { path: 'survey/:id', component: SingleSurveyView },
];
