import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonInput,
  IonLabel,
  IonCard,
  IonCardContent,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  saveOutline
} from 'ionicons/icons';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
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
    IonInput,
    IonLabel,
    IonCard,
    IonCardContent
  ]
})
export class ChangePasswordPage {

  private authService = inject(AuthService);

  private router = inject(Router);

  private location = inject(Location);

  private toastController = inject(ToastController);

  private loadingController = inject(LoadingController);

  mostrarActual = false;

  mostrarNueva = false;

  mostrarConfirmar = false;

  datos = {

    passwordActual: '',

    passwordNueva: '',

    confirmarPassword: ''

  };

  constructor() {

    addIcons({

      arrowBackOutline,

      lockClosedOutline,

      eyeOutline,

      eyeOffOutline,

      saveOutline

    });

  }

  volver() {

    this.location.back();

  }

  async guardar() {

    if (

      !this.datos.passwordActual ||

      !this.datos.passwordNueva ||

      !this.datos.confirmarPassword

    ) {

      return this.toast(

        'Complete todos los campos.',

        'warning'

      );

    }

    if (

      this.datos.passwordNueva.length < 6

    ) {

      return this.toast(

        'La nueva contraseña debe tener mínimo 6 caracteres.',

        'warning'

      );

    }

    if (

      this.datos.passwordNueva !==

      this.datos.confirmarPassword

    ) {

      return this.toast(

        'Las contraseñas no coinciden.',

        'warning'

      );

    }

    const loading = await this.loadingController.create({

      message: 'Actualizando contraseña...'

    });

    await loading.present();

    this.authService

      .cambiarPassword({

        passwordActual: this.datos.passwordActual,

        passwordNueva: this.datos.passwordNueva

      })

      .subscribe({

        next: async () => {

          await loading.dismiss();

          await this.toast(

            'Contraseña actualizada correctamente.',

            'success'

          );

          this.router.navigateByUrl('/profile');

        },

        error: async (err) => {

          await loading.dismiss();

          await this.toast(

            err.error?.message ||

            'No fue posible actualizar la contraseña.',

            'danger'

          );

        }

      });

  }

  async toast(

    message: string,

    color: 'success' | 'warning' | 'danger'

  ) {

    const toast = await this.toastController.create({

      message,

      duration: 2000,

      color

    });

    await toast.present();

  }

}