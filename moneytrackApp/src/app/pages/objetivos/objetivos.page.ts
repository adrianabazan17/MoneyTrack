import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { NotificacionService } from '../../services/notificacion';

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
  AlertController,
  ToastController,
  IonProgressBar
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  addOutline,
  createOutline,
  trashOutline
} from 'ionicons/icons';

import { ObjetivoService } from '../../services/objetivo';

@Component({
  selector: 'app-objetivos',
  templateUrl: './objetivos.page.html',
  styleUrls: ['./objetivos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonProgressBar
  ]
})
export class ObjetivosPage {

  private objetivoService = inject(ObjetivoService);

  private router = inject(Router);

  private location = inject(Location);

  private alertController = inject(AlertController);

  private toastController = inject(ToastController);

  private notificacion = inject(NotificacionService);

  objetivos: any[] = [];

  constructor() {

    addIcons({

      arrowBackOutline,

      addOutline,

      createOutline,

      trashOutline

    });

  }

  ionViewWillEnter() {

    this.cargarObjetivos();

  }

  cargarObjetivos() {

    this.objetivoService.listar().subscribe({

      next: (resp: any) => {

        this.objetivos = resp.data;

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  volver() {

    this.location.back();

  }

  nuevo() {

    this.router.navigate(['/objetivo-form']);

  }

  editar(id: number) {

    this.router.navigate(['/objetivo-form', id]);

  }

  async eliminar(id: number) {

    const alert = await this.alertController.create({

      header: 'Eliminar objetivo',

      message: '¿Desea eliminar este objetivo?',

      buttons: [

        {

          text: 'Cancelar',

          role: 'cancel'

        },

        {

          text: 'Eliminar',

          role: 'destructive',

          handler: () => {

            this.objetivoService.eliminar(id).subscribe({

              next: async () => {

                this.cargarObjetivos();

                const toast = await this.toastController.create({

                  message: 'Objetivo eliminado.',

                  duration: 2000,

                  color: 'success'

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

  async agregarAhorro(objetivo: any) {

    const alert = await this.alertController.create({

      header: 'Agregar ahorro',

      message: `Objetivo: ${objetivo.nombre}`,

      inputs: [

        {

          name: 'monto',

          type: 'number',

          placeholder: 'Ingrese el monto'

        }

      ],

      buttons: [

        {

          text: 'Cancelar',

          role: 'cancel'

        },

        {

          text: 'Guardar',

          handler: (data) => {

            const monto = Number(data.monto);

            if (!monto || monto <= 0) {

              this.mostrarToast(

                'Ingrese un monto válido.',

                'warning'

              );

              return false;

            }

            this.objetivoService

              .agregarAhorro(objetivo.id, monto)

              .subscribe({

                next: async (resp: any) => {

                  this.cargarObjetivos();

                  if (resp.completado) {

                    await this.notificacion.mostrar(

                      '🎉 ¡Objetivo cumplido!',

                      `Has alcanzado tu objetivo "${objetivo.nombre}". ¡Felicitaciones!`

                    );

                    const alert = await this.alertController.create({

                      header: '🎉 ¡Felicidades!',

                      message:
                        'Has alcanzado tu objetivo de ahorro. ¡Sigue administrando tu dinero de esta manera!',

                      buttons: ['Continuar']

                    });

                    await alert.present();

                  } else {

                    await this.notificacion.mostrar(

                      '💵 Ahorro agregado',

                      `Se agregaron $${monto.toFixed(2)} al objetivo "${objetivo.nombre}".`

                    );

                    await this.mostrarToast(

                      'Ahorro agregado correctamente.',

                      'success'

                    );

                  }

                },

                error: async () => {

                  await this.mostrarToast(

                    'No fue posible agregar el ahorro.',

                    'danger'

                  );

                }

              });

            return true;

          }

        }

      ]

    });

    await alert.present();

  }

  async mostrarToast(
    mensaje: string,
    color: 'success' | 'warning' | 'danger'
  ) {

    const toast = await this.toastController.create({

      message: mensaje,

      duration: 2000,

      color

    });

    await toast.present();

  }

}
