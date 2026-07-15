import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
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
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { ReporteService } from '../../services/reporte';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  cashOutline,
  cardOutline,
  walletOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
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
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption
  ]
})
export class ReportesPage implements OnInit {

  private reporteService = inject(ReporteService);

  private location = inject(Location);

  ingresos = 0;
  gastos = 0;
  saldo = 0;

  grafico: Chart | undefined;

  graficoResumen: Chart | undefined;

  detalleCategorias: any[] = [];

  usuario: any = null;

  @ViewChild('graficoCategorias')
  graficoCategoriasCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('graficoResumen')
  graficoResumenCanvas!: ElementRef<HTMLCanvasElement>;

  mes = new Date().getMonth() + 1;

  anio = new Date().getFullYear();

  meses = [

    { id: 1, nombre: 'Enero' },
    { id: 2, nombre: 'Febrero' },
    { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' },
    { id: 5, nombre: 'Mayo' },
    { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' },
    { id: 8, nombre: 'Agosto' },
    { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' },
    { id: 12, nombre: 'Diciembre' }

  ];

  constructor() {

    addIcons({

      arrowBackOutline,

      cashOutline,

      cardOutline,

      walletOutline

    });

    const datos = localStorage.getItem('usuario');

      if (datos) {

        this.usuario = JSON.parse(datos);

      }


  }


  ngOnInit() {

    this.cargarResumen();

    this.cargarGrafico();

  }

  cargarResumen() {

    this.reporteService
      .resumen(this.mes, this.anio)
      .subscribe({

        next: (resp: any) => {

          this.ingresos = Number(resp.data.ingresos);

          this.gastos = Number(resp.data.gastos);

          this.saldo = Number(resp.data.saldo);

          this.cargarGraficoResumen();

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  cargarGrafico() {

    this.reporteService
      .gastosPorCategoria(this.mes, this.anio)
      .subscribe({

        next: (resp: any) => {

          const labels = resp.data.map((x: any) => x.categoria);

          const datos = resp.data.map((x: any) => Number(x.total));

          const total = datos.reduce((a: number, b: number) => a + b, 0);

          this.detalleCategorias = resp.data.map((item: any) => ({

            ...item,

            porcentaje: total > 0

              ? ((Number(item.total) * 100) / total).toFixed(1)

              : '0'

          }));

          if (this.grafico) {

            this.grafico.destroy();

          }

          this.grafico = new Chart(

            'graficoCategorias',

            {

              type: 'pie',

              data: {

                labels,

                datasets: [

                  {

                    data: datos,

                    backgroundColor: [

                      '#7C3AED',
                      '#A855F7',
                      '#3B82F6',
                      '#10B981',
                      '#F59E0B',
                      '#EF4444',
                      '#06B6D4',
                      '#8B5CF6',
                      '#84CC16',
                      '#F97316'

                    ],

                    borderColor: '#ffffff',

                    borderWidth: 2,

                    hoverOffset: 15

                  }

                ]

              },

              options: {

                responsive: true,

                plugins: {

                  legend: {

                    position: 'bottom',

                    labels: {

                      usePointStyle: true,

                      padding: 20,

                      font: {

                        size: 14

                      }

                    }

                  },

                  title: {

                    display: true,

                    text: 'Distribución de gastos',

                    font: {

                      size: 18

                    }

                  }

                }

              }

            }

          );

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  cargarGraficoResumen() {

    if (this.graficoResumen) {

      this.graficoResumen.destroy();

    }

    this.graficoResumen = new Chart(

      'graficoResumen',

      {

        type: 'bar',

        data: {

          labels: [

            'Ingresos',

            'Gastos'

          ],

          datasets: [

            {

              label: 'Monto ($)',

              data: [

                this.ingresos,

                this.gastos

              ],

              backgroundColor: [

                '#16a34a',

                '#dc2626'

              ]

            }

          ]

        },

        options: {

          responsive: true,

          plugins: {

            legend: {

              display: false

            },

            title: {

              display: true,

              text: 'Comparación mensual',

              font: {

                size: 18

              }

            }

          },

          scales: {

            y: {

              beginAtZero: true

            }

          }

        }

      }

    );

  }

  cambiarPeriodo() {

    this.cargarResumen();

    this.cargarGrafico();

  }

  volver() {

    this.location.back();

  }

  async exportarPDF() {

    const doc = new jsPDF();

    const ahora = new Date();

    const fecha = ahora.toLocaleDateString('es-EC');

    const hora = ahora.toLocaleTimeString('es-EC');

    const nombreMes =
      this.meses.find(m => m.id === this.mes)?.nombre;

    // Encabezado
    doc.setFillColor(124, 58, 237);

    doc.rect(0, 0, 210, 28, 'F');

    doc.setTextColor(255, 255, 255);

    doc.setFontSize(22);

    doc.text(
      'MoneyTrack',
      105,
      15,
      { align: 'center' }
    );

    doc.setFontSize(12);

    doc.text(
      'Reporte Financiero',
      105,
      23,
      { align: 'center' }
    );

    doc.setTextColor(0, 0, 0);

    // Información del usuario
    doc.setFontSize(16);

    doc.text(
      'Información del usuario',
      15,
      40
    );

    doc.setFontSize(12);

    doc.text(
      `Nombre: ${this.usuario?.nombres ?? ''} ${this.usuario?.apellidos ?? ''}`,
      15,
      50
    );

    doc.text(
      `Correo: ${this.usuario?.correo ?? ''}`,
      15,
      58
    );

    doc.text(
      `Mes del reporte: ${nombreMes} ${this.anio}`,
      15,
      66
    );

    doc.text(
      `Fecha de generación: ${fecha}`,
      15,
      74
    );

    doc.text(
      `Hora de generación: ${hora}`,
      15,
      82
    );

    // Resumen
    doc.setFontSize(16);

    doc.text(
      'Resumen financiero',
      15,
      98
    );

    doc.setFontSize(12);

    doc.text(
      `Ingresos: $${this.ingresos.toFixed(2)}`,
      20,
      108
    );

    doc.text(
      `Gastos: $${this.gastos.toFixed(2)}`,
      20,
      116
    );

    doc.text(
      `Saldo: $${this.saldo.toFixed(2)}`,
      20,
      124
    );

    // Tabla
    autoTable(doc, {

      startY: 135,

      head: [[
        'Categoría',
        'Total',
        'Porcentaje'
      ]],

      body: this.detalleCategorias.map(x => [

        x.categoria,

        `$${Number(x.total).toFixed(2)}`,

        `${x.porcentaje}%`

      ])

    });

    // Posición donde termina la tabla
    const y =
      (doc as any).lastAutoTable.finalY + 10;

    // Imagen del gráfico circular
    const imagenPie =
      this.graficoCategoriasCanvas
        .nativeElement
        .toDataURL('image/png');

    doc.setFontSize(15);

    doc.text(
      'Distribución de gastos por categoría',
      15,
      y
    );

    doc.addImage(

      imagenPie,

      'PNG',

      35,

      y + 5,

      140,

      90

    );

    // Segunda página
    doc.addPage();

    doc.setFontSize(18);

    doc.text(
      'Comparación mensual',
      15,
      20
    );

    // Imagen del gráfico de barras
    const imagenBarras =
      this.graficoResumenCanvas
        .nativeElement
        .toDataURL('image/png');

    doc.addImage(

      imagenBarras,

      'PNG',

      20,

      30,

      170,

      95

    );

    // Pie de página
    const paginas = doc.getNumberOfPages();

    for (let i = 1; i <= paginas; i++) {

      doc.setPage(i);

      doc.setFontSize(10);

      doc.setTextColor(120);

      doc.text(

        `Generado automáticamente por MoneyTrack - Página ${i} de ${paginas}`,

        105,

        290,

        {

          align: 'center'

        }

      );

    }

    const nombreArchivo =
      `Reporte_${nombreMes}_${this.anio}.pdf`;

    if (Capacitor.getPlatform() === 'web') {

      doc.save(nombreArchivo);

    } else {

      const pdfBase64 = doc.output('datauristring').split(',')[1];

      const archivo = await Filesystem.writeFile({

        path: nombreArchivo,

        data: pdfBase64,

        directory: Directory.Documents

      });

      await Share.share({

        title: 'Reporte MoneyTrack',

        text: 'Reporte financiero generado correctamente.',

        url: archivo.uri,

        dialogTitle: 'Abrir o compartir reporte'

      });

    }

  }

}