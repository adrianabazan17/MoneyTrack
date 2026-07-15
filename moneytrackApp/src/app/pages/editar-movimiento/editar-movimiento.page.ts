import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

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

import { ToastController } from '@ionic/angular';

import { CategoriaService } from '../../services/categoria';
import { MovimientoService } from '../../services/movimiento';

import { addIcons } from 'ionicons';
import {
  saveOutline,
  cashOutline,
  cardOutline,
  arrowBackOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-editar-movimiento',
  templateUrl: './editar-movimiento.page.html',
  styleUrls: ['./editar-movimiento.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,

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
    IonDatetime
  ]
})
export class EditarMovimientoPage implements OnInit {

  private fb = inject(FormBuilder);

  private categoriaService = inject(CategoriaService);

  private movimientoService = inject(MovimientoService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private location = inject(Location);

  private toastController = inject(ToastController);

  id!: number;

  categorias: any[] = [];

  categoriasFiltradas: any[] = [];

  movimientoForm = this.fb.group({

    tipo_movimiento: ['Ingreso', Validators.required],

    categoria_id: ['', Validators.required],

    descripcion: ['', Validators.required],

    monto: ['', Validators.required],

    fecha: ['', Validators.required],

    observacion: ['']

  });

  constructor() {

    addIcons({

      saveOutline,
      cashOutline,
      cardOutline,
      arrowBackOutline

    });

  }

  ngOnInit() {

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.cargarCategorias();

  }

  volver() {

    this.location.back();

  }

  cargarCategorias() {

    this.categoriaService.listar().subscribe({

      next: (resp: any) => {

        this.categorias = resp.data;

        this.cargarMovimiento();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  cargarMovimiento() {

    this.movimientoService.obtenerPorId(this.id).subscribe({

      next: (resp: any) => {

        const mov = resp.data;

        const categoria = this.categorias.find(

          (c: any) => c.id == mov.categoria_id

        );

        const tipo = categoria?.tipo_movimiento || 'Ingreso';

        this.movimientoForm.patchValue({

          tipo_movimiento: tipo,

          categoria_id: mov.categoria_id,

          descripcion: mov.descripcion,

          monto: mov.monto,

          fecha: mov.fecha,

          observacion: mov.observacion

        });

        this.filtrarCategorias(tipo);

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  cambiarTipo(event: any) {

    const tipo = event.detail.value;

    this.filtrarCategorias(tipo);

    this.movimientoForm.patchValue({

      categoria_id: ''

    });

  }

  filtrarCategorias(tipo: string) {

    this.categoriasFiltradas = this.categorias.filter(

      (c: any) => c.tipo_movimiento === tipo

    );

  }

  guardar() {

    if (this.movimientoForm.invalid) {

      this.movimientoForm.markAllAsTouched();

      return;

    }

    const data = {

      categoria_id: this.movimientoForm.value.categoria_id,

      descripcion: this.movimientoForm.value.descripcion,

      monto: this.movimientoForm.value.monto,

      fecha: this.movimientoForm.value.fecha,

      observacion: this.movimientoForm.value.observacion

    };

    this.movimientoService.actualizar(this.id, data).subscribe({

      next: async () => {

        const toast = await this.toastController.create({

          message: 'Movimiento actualizado correctamente.',

          duration: 2000,

          color: 'success',

          position: 'top'

        });

        await toast.present();

        this.router.navigate(['/dashboard'],{
          replaceUrl:true
        });

      },

      error: async (err) => {

        console.error(err);

        const toast = await this.toastController.create({

          message: 'No se pudo actualizar el movimiento.',

          duration: 2000,

          color: 'danger',

          position: 'top'

        });

        await toast.present();

      }

    });

  }

}
