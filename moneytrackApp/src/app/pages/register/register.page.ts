import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  ToastController
} from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth';
import { addIcons } from 'ionicons';
import {
  personOutline, walletOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,

    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonCard,
    IonCardContent,
    IonIcon
  ]
})
export class RegisterPage {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  mostrarPassword = false;
  mostrarConfirmar = false;

  registerForm = this.fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmarPassword: ['', Validators.required]
  });

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  toggleConfirmar() {
    this.mostrarConfirmar = !this.mostrarConfirmar;
  }

  async mostrarToast(
    mensaje: string,
    color: 'dark' | 'danger' | 'warning' | 'primary'
  ) {

    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2500,
      position: 'top',
      color: color
    });

    await toast.present();

  }

  registrar() {

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      this.mostrarToast(
        'Complete todos los campos correctamente.',
        'warning'
      );

      return;

    }

    if (
      this.registerForm.value.password !==
      this.registerForm.value.confirmarPassword
    ) {

      this.mostrarToast(
        'Las contraseñas no coinciden.',
        'warning'
      );

      return;

    }

    const datos = {

      nombres: this.registerForm.value.nombres,
      apellidos: this.registerForm.value.apellidos,
      correo: this.registerForm.value.correo,
      password: this.registerForm.value.password

    };

    this.authService.register(datos).subscribe({

      next: async (resp: any) => {

        await this.mostrarToast(
          resp.message,
          'dark'
        );

        setTimeout(() => {

          this.router.navigate(['/login']);

        }, 1800);

      },

      error: async (err) => {

        await this.mostrarToast(

          err.error?.message || 'Ocurrió un error.',

          'danger'

        );

      }

    });

  }

}

addIcons({
  personOutline,
  walletOutline,
  mailOutline,
  lockClosedOutline
});