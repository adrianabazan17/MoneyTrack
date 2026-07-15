import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { CategoriaService } from '../../services/categoria';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonDatetime,
  IonDatetimeButton,
  IonModal
} from '@ionic/angular/standalone';

import {
  AlertController,
  ToastController
} from '@ionic/angular';

import { MovimientoService } from '../../services/movimiento';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  createOutline,
  trashOutline,
  cashOutline,
  cardOutline,
  chevronDownOutline,
  chevronUpOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.page.html',
  styleUrls: ['./movimientos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel,
    IonDatetime,
    IonDatetimeButton,
    IonModal
  ]
})
export class MovimientosPage {

  private movimientoService = inject(MovimientoService);

  private location = inject(Location);

  private alertController = inject(AlertController);

  private toastController = inject(ToastController);

  private router = inject(Router);

  private categoriaService = inject(CategoriaService);

  movimientos: any[] = [];

  categorias: any[] = [];

  mostrarFiltros = false;

  filtros = {

    buscar: '',

    tipo: '',

    categoria: '',

    desde: new Date().toISOString(),

    hasta: new Date().toISOString()

  };

  constructor() {

    addIcons({

      arrowBackOutline,

      createOutline,

      trashOutline,

      cashOutline,

      cardOutline,

      chevronDownOutline,
      
      chevronUpOutline

    });

  }
  toggleFiltros() {

    this.mostrarFiltros = !this.mostrarFiltros;

  }

  ionViewWillEnter() {

    this.cargarCategorias();
    this.cargarMovimientos();

  }

  cargarMovimientos() {

    this.movimientoService.listar(this.filtros).subscribe({

      next: (resp: any) => {

        this.movimientos = resp.data;

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  volver() {

    this.location.back();

  }

  editar(id:number){

    this.router.navigate(['/editar-movimiento', id]);

  }

  async eliminar(id: number) {

    const alert = await this.alertController.create({

      header: 'Eliminar movimiento',

      message: '¿Desea eliminar este movimiento?',

      buttons: [

        {
          text: 'Cancelar',
          role: 'cancel'
        },

        {

          text: 'Eliminar',

          role: 'destructive',

          handler: () => {

            this.movimientoService.eliminar(id).subscribe({

              next: async () => {

                const toast = await this.toastController.create({

                  message: 'Movimiento eliminado correctamente.',

                  duration: 2000,

                  color: 'success',

                  position: 'top'

                });

                await toast.present();

                // Actualiza la lista desde la API
                this.cargarMovimientos();

              },

              error: async () => {

                const toast = await this.toastController.create({

                  message: 'No se pudo eliminar el movimiento.',

                  duration: 2000,

                  color: 'danger',

                  position: 'top'

                });

                await toast.present();

              }

            });

          }

        }

      ]

    });

    await alert.present();

  }

  cargarCategorias() {

    this.categoriaService.listar().subscribe({

      next: (resp: any) => {

        this.categorias = resp.data;

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  aplicarFiltros() {

    this.cargarMovimientos();

  }

  limpiarFiltros() {

    this.filtros = {

      buscar: '',

      tipo: '',

      categoria: '',

      desde: '',

      hasta: ''

    };

    this.cargarMovimientos();

  }

}