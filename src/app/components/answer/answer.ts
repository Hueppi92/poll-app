import { Component, input, output } from '@angular/core';
import type { Answer } from '../interfaces/survey';
import { NumerationPipe } from '../../pipes/numeration.pipe';

export interface AnswerToggled {
  answerId: number;
  checked: boolean;
}

@Component({
  selector: 'app-answer',
  imports: [NumerationPipe],
  templateUrl: './answer.html',
  styleUrls: ['./answer.scss'],
})
export class AnswerClass {
  answer = input.required<Answer>();
  index = input.required<number>();
  selected = input(false);
  disabled = input(false);
  toggled = output<AnswerToggled>();

  onToggle(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggled.emit({ answerId: this.answer().id, checked });
  }
}