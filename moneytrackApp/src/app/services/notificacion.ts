import { Injectable } from '@angular/core';

import {

  LocalNotifications,

  PermissionStatus

} from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  async solicitarPermisos() {

    const permiso: PermissionStatus =

      await LocalNotifications.requestPermissions();

    return permiso.display === 'granted';

  }

  async mostrar(

    titulo: string,

    mensaje: string

  ) {

    await this.solicitarPermisos();

    await LocalNotifications.schedule({

      notifications: [

        {

          id: Date.now(),

          title: titulo,

          body: mensaje,

          schedule: {

            at: new Date(Date.now() + 500)

          }

        }

      ]

    });

  }

}
