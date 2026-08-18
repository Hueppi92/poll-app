import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { SingleSurveyView } from './components/single-survey-view/single-survey-view';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'survey/:id', component: SingleSurveyView },
];
