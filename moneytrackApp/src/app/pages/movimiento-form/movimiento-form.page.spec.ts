import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovimientoFormPage } from './movimiento-form.page';

describe('MovimientoFormPage', () => {
  let component: MovimientoFormPage;
  let fixture: ComponentFixture<MovimientoFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimientoFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
