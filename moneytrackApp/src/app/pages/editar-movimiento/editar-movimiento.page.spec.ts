import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarMovimientoPage } from './editar-movimiento.page';

describe('EditarMovimientoPage', () => {
  let component: EditarMovimientoPage;
  let fixture: ComponentFixture<EditarMovimientoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarMovimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
