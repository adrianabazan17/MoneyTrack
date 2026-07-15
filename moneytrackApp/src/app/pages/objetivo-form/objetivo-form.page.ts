import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonDatetime,
  IonDatetimeButton,
  IonCard,
  IonCardContent,
  IonModal,
  ToastController
} from '@ionic/angular/standalone';
import { ObjetivoService } from '../../services/objetivo';
import { NotificacionService } from '../../services/notificacion';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  saveOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-objetivo-form',
  templateUrl: './objetivo-form.page.html',
  styleUrls: ['./objetivo-form.page.scss'],
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
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonDatetime,
    IonCard,
    IonCardContent,
    IonDatetimeButton,
    IonModal

  ]

})
export class ObjetivoFormPage implements OnInit {

  private objetivoService = inject(ObjetivoService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private location = inject(Location);

  private toastController = inject(ToastController);

  private notificacion = inject(NotificacionService);

  editando = false;

  id = 0;

  objetivo = {

    nombre: '',

    descripcion: '',

    monto_meta: null,

    fecha_limite: new Date().toISOString()

  };

  constructor() {

    addIcons({

      arrowBackOutline,

      saveOutline

    });

  }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.editando = true;

      this.id = Number(id);

      this.cargarObjetivo();

    }

  }

  cargarObjetivo() {

    this.objetivoService

      .obtenerPorId(this.id)

      .subscribe({

        next: (resp: any) => {

          this.objetivo = resp.data;

        }

      });

  }

  guardar() {

    if (this.editando) {

      this.objetivoService

        .actualizar(this.id, this.objetivo)

        .subscribe({

          next: async () => {

            const toast = await this.toastController.create({

              message: 'Objetivo actualizado correctamente.',

              duration: 2000,

              color: 'success'

            });

            await toast.present();

            await this.notificacion.mostrar(

              '✏️ Objetivo actualizado',

              `El objetivo "${this.objetivo.nombre}" fue actualizado correctamente.`

            );

            this.router.navigateByUrl(

              '/objetivos',

              {

                replaceUrl: true

              }

            );

          }

        });

    } else {

      this.objetivoService

        .guardar(this.objetivo)

        .subscribe({

          next: async () => {

              const toast = await this.toastController.create({

                message: 'Objetivo creado correctamente.',

                duration: 2000,

                color: 'success'

              });

              await toast.present();

              await this.notificacion.mostrar(

                '🎯 Nuevo objetivo',

                `Has creado el objetivo "${this.objetivo.nombre}".`

              );

              this.router.navigateByUrl(

                '/objetivos',

                {

                  replaceUrl: true

                }

              );

            }

        });

    }

  }

  volver() {

    this.location.back();

  }

}
