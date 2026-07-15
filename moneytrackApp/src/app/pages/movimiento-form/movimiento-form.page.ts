import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../services/categoria';
import { MovimientoService } from '../../services/movimiento';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NotificacionService } from '../../services/notificacion';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Location } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonDatetime,
  IonButtons
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  saveOutline,
  cashOutline,
  cardOutline, arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-movimiento-form',
  templateUrl: './movimiento-form.page.html',
  styleUrls: ['./movimiento-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    IonIcon,
    IonDatetime,
    IonButtons
  ]
})
export class MovimientoFormPage implements OnInit {

  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaService);
  private movimientoService = inject(MovimientoService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private location = inject(Location);
  private notificacion = inject(NotificacionService);
  movimientoForm = this.fb.group({

    tipo_movimiento: ['Ingreso', Validators.required],

    categoria_id: ['', Validators.required],

    descripcion: ['', Validators.required],

    monto: ['', Validators.required],

    fecha: [new Date().toISOString(), Validators.required],

    observacion: ['']

  });

  categorias: any[] = [];

  categoriasFiltradas: any[] = [];

  categoriaSeleccionada: any = null;

  constructor() {

    addIcons({arrowBackOutline,cashOutline,cardOutline,saveOutline});

  }

  ngOnInit() {
    this.cargarCategorias();

  }

  volver() {

    this.location.back();

  }

  cargarCategorias() {

    this.categoriaService.listar().subscribe({

      next: (resp: any) => {

        this.categorias = resp.data;

        this.filtrarCategorias(
          this.movimientoForm.value.tipo_movimiento
        );

      },

      error: (error) => {

        console.error(error);

      }

    });

  }

  filtrarCategorias(tipo: any) {

    this.categoriasFiltradas =
      this.categorias.filter(

        (c: any) => c.tipo_movimiento === tipo

      );

  }

  cambiarTipo(event: any) {

    this.filtrarCategorias(

      event.detail.value

    );

    this.movimientoForm.patchValue({

      categoria_id: ''

    });

  }

  async guardar() {

    if (this.movimientoForm.invalid) {

      this.movimientoForm.markAllAsTouched();

      return;

    }

    const datos = {

      ...this.movimientoForm.value,

      fecha: this.movimientoForm.value.fecha?.toString().substring(0, 10)

    };

    this.movimientoService.guardar(datos).subscribe({

      next: async (resp: any) => {

        const toast = await this.toastController.create({

          message: resp.message,

          duration: 2000,

          color: 'success',

          position: 'top'

        });

        await toast.present();

        const tipo = this.movimientoForm.value.tipo_movimiento;

        const monto = Number(this.movimientoForm.value.monto).toFixed(2);

        if (tipo === 'Ingreso') {

          await this.notificacion.mostrar(

            '💰 Ingreso registrado',

            `Se registró un ingreso de $${monto}.`

          );

        } else {

          await this.notificacion.mostrar(

            '💸 Gasto registrado',

            `Se registró un gasto de $${monto}.`

          );

        }

        this.router.navigateByUrl('/dashboard', {

          replaceUrl: true

        });

      },

      error: async (err) => {

        console.error(err);

        const toast = await this.toastController.create({

          message: err.error?.message || 'Error al registrar el movimiento.',

          duration: 2500,

          color: 'danger',
          position: 'top'

        });

        await toast.present();

      }

    });

  }

}
