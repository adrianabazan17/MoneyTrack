import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private http = inject(HttpClient);

  private api = 'http://localhost:3000/api/reportes';

  private getHeaders() {

    const token = localStorage.getItem('token');

    return {

      headers: new HttpHeaders({

        Authorization: `Bearer ${token}`

      })

    };

  }

  resumen(mes:number, anio:number){

    return this.http.get(

      `${this.api}/resumen?mes=${mes}&anio=${anio}`,

      this.getHeaders()

    );

  }

  gastosPorCategoria(mes:number, anio:number){

    return this.http.get(

      `${this.api}/gastos-categoria?mes=${mes}&anio=${anio}`,

      this.getHeaders()

    );

  }

}
