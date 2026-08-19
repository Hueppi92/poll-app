import { Component, input } from '@angular/core';
import type { Answer } from '../interfaces/survey';
import { NumerationPipe } from '../../pipes/numeration.pipe';

@Component({
  selector: 'app-answer',
  imports: [NumerationPipe],
  templateUrl: './answer.html',
  styleUrls: ['./answer.scss'],
})
export class AnswerClass {
  answer = input.required<Answer>();
  index = input.required<number>();
}