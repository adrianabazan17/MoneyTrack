import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

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
  IonItem,
  IonLabel,
  IonList,
  AlertController
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  personCircleOutline,
  logOutOutline,
  mailOutline,
  personOutline,
  lockClosedOutline,
  informationCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
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
    IonItem,
    IonLabel,
    IonList
  ]
})
export class ProfilePage {

  private router = inject(Router);

  private location = inject(Location);

  private alertController = inject(AlertController);

  usuario: any = null;

  constructor() {

    addIcons({

      arrowBackOutline,

      personCircleOutline,

      logOutOutline,

      mailOutline,

      personOutline,

      lockClosedOutline,

      informationCircleOutline

    });

    const datos = localStorage.getItem('usuario');

    if (datos) {

      this.usuario = JSON.parse(datos);

    }

  }

  volver() {

    this.location.back();

  }

  cambiarPassword() {

    this.router.navigate(['/change-password']);

  }

  acercaDe() {

    alert('MoneyTrack\nElaborado por:\nAdriana Cujilema B\nVersión 1.0.0');

  }

  async cerrarSesion() {

    const alert = await this.alertController.create({

      header: 'Cerrar sesión',

      message: '¿Está seguro que desea cerrar la sesión?',

      buttons: [

        {

          text: 'Cancelar',

          role: 'cancel'

        },

        {

          text: 'Cerrar sesión',

          role: 'destructive',

          handler: () => {

            localStorage.removeItem('token');

            localStorage.removeItem('usuario');

            this.router.navigateByUrl('/login', {

              replaceUrl: true

            });

          }

        }

      ]

    });

    await alert.present();

  }

}