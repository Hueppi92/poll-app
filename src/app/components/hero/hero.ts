import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  private router = inject(Router);

  createSurvey(): void {
    this.router.navigateByUrl('/survey/new');
  }
}
