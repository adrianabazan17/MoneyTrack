import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObjetivoFormPage } from './objetivo-form.page';

describe('ObjetivoFormPage', () => {
  let component: ObjetivoFormPage;
  let fixture: ComponentFixture<ObjetivoFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjetivoFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
