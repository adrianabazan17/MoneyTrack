import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonButton,
  IonButtons,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  walletOutline,
  cashOutline,
  trendingDownOutline,
  addCircleOutline, 
  listOutline, 
  personCircleOutline,
  barChartOutline, 
  timeOutline, flagOutline } from 'ionicons/icons';

import { DashboardService } from '../../services/dashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonButton,
    IonButtons,
    IonIcon
  ]
})
export class DashboardPage implements OnInit {

  private dashboardService = inject(DashboardService);

  usuario: any = null;

  totalIngresos = 0;
  totalGastos = 0;
  saldo = 0;

  ultimosMovimientos: any[] = [];

  constructor() {

    addIcons({personCircleOutline,walletOutline,cashOutline,trendingDownOutline,addCircleOutline,listOutline,barChartOutline,flagOutline,timeOutline});

    const datos = localStorage.getItem('usuario');

    if (datos) {
      this.usuario = JSON.parse(datos);
    }

  }

  ngOnInit(): void {
  }
  ionViewWillEnter() {

    this.cargarDashboard();

  }

  cargarDashboard() {

    this.dashboardService.obtenerDashboard().subscribe({

      next: (resp: any) => {

        this.totalIngresos = Number(resp.data.totalIngresos);
        this.totalGastos = Number(resp.data.totalGastos);
        this.saldo = Number(resp.data.saldo);

        this.ultimosMovimientos = resp.data.ultimosMovimientos;

      },

      error: (error) => {

        console.error(error);

      }

    });

  }

}
