import { Component, input } from '@angular/core';
import type { Answer } from '../interfaces/survey';

@Component({
  selector: 'app-answer',
  imports: [],
  templateUrl: './answer.html',
  styleUrls: ['./answer.scss'],
})
export class AnswerClass {
  answer = input.required<Answer>();
}