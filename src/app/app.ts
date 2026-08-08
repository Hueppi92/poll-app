import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Hero } from './hero/hero';
import { SurveyOverview } from './survey-overview/survey-overview';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Hero, SurveyOverview],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('poll-app');
}
