import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewContainerComponent } from './preview-container';

describe('PreviewContainerComponent', () => {
  let component: PreviewContainerComponent;
  let fixture: ComponentFixture<PreviewContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewContainerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
