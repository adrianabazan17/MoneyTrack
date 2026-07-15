import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  private http = inject(HttpClient);

  private api = 'http://localhost:3000/api/movimientos';

  private getHeaders() {

    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };

  }

  listar(filtros?: any) {

    let params = new HttpParams();

    if (filtros) {

      if (filtros.buscar) {

        params = params.set('buscar', filtros.buscar);

      }

      if (filtros.tipo) {

        params = params.set('tipo', filtros.tipo);

      }

      if (filtros.categoria) {

        params = params.set('categoria', filtros.categoria);

      }

      if (filtros.desde) {

        params = params.set('desde', filtros.desde);

      }

      if (filtros.hasta) {

        params = params.set('hasta', filtros.hasta);

      }

    }

    return this.http.get(

      this.api,

      {

        ...this.getHeaders(),

        params

      }

    );

  }

  guardar(data: any) {

    return this.http.post(
      this.api,
      data,
      this.getHeaders()
    );

  }

  actualizar(id: number, data: any) {

    return this.http.put(
      `${this.api}/${id}`,
      data,
      this.getHeaders()
    );

  }

  eliminar(id: number) {

    return this.http.delete(
      `${this.api}/${id}`,
      this.getHeaders()
    );

  }

  obtenerPorId(id: number) {

    return this.http.get(

      `${this.api}/${id}`,

      this.getHeaders()

    );

  }

}