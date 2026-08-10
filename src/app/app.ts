import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { PreviewContainerComponent } from './components/preview-container/preview-container';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Hero, PreviewContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('poll-app');
}   