import { inject, Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ObjetivoService {

  private http = inject(HttpClient);

  private api = 'http://localhost:3000/api/objetivos';

  private getHeaders() {

    const token = localStorage.getItem('token');

    return {

      headers: new HttpHeaders({

        Authorization: `Bearer ${token}`

      })

    };

  }

  listar() {

    return this.http.get(

      this.api,

      this.getHeaders()

    );

  }

  guardar(data: any) {

    return this.http.post(

      this.api,

      data,

      this.getHeaders()

    );

  }

  obtenerPorId(id: number) {

    return this.http.get(

      `${this.api}/${id}`,

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

  agregarAhorro(id: number, monto: number) {

    return this.http.post(

      `${this.api}/${id}/ahorro`,

      { monto },

      this.getHeaders()

    );

  }


}




