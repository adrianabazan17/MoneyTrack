import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificacionService } from '../../services/notificacion';

import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  ToastController
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  walletOutline,
  mailOutline,
  lockClosedOutline
} from 'ionicons/icons';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,

    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCard,
    IonCardContent,
    IonIcon
  ]
})
export class LoginPage {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private notificacion = inject(NotificacionService);

  mostrarPassword = false;

  loginForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor() {

    addIcons({
      walletOutline,
      mailOutline,
      lockClosedOutline
    });

  }

  async mostrarToast(
    mensaje: string,
    color: 'dark' | 'danger' | 'warning' | 'primary'
  ) {

    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2500,
      position: 'top',
      color
    });

    await toast.present();

  }

  iniciarSesion() {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      this.mostrarToast(
        'Ingrese su correo y contraseña.',
        'warning'
      );

      return;

    }

    this.authService.login(this.loginForm.value).subscribe({

      next: async (resp: any) => {

        // Guardar el token
        localStorage.setItem('token', resp.token);

        // Guardar los datos del usuario
        localStorage.setItem(
          'usuario',
          JSON.stringify(resp.usuario)
        );

        // Toast de la aplicación
        await this.mostrarToast(

          `¡Bienvenido ${resp.usuario.nombres}!`,

          'dark'

        );

        // Notificación nativa (Android)
        await this.notificacion.mostrar(

          '👋 Bienvenido a MoneyTrack',

          `${resp.usuario.nombres}, has iniciado sesión correctamente.`

        );

        setTimeout(() => {

          this.router.navigate(['/dashboard']);

        }, 1200);

      },

      error: async (err) => {

        await this.mostrarToast(

          err.error?.message || 'Credenciales incorrectas.',

          'danger'

        );

      }

    });

  }

  togglePassword() {

    this.mostrarPassword = !this.mostrarPassword;

  }

}