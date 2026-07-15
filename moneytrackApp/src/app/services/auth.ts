import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/auth`;

  login(datos: any): Observable<any> {

    return this.http.post(

      `${this.api}/login`,

      datos

    );

  }

  register(datos: any): Observable<any> {

    return this.http.post(

      `${this.api}/register`,

      datos

    );

  }

  private getHeaders() {

    const token = localStorage.getItem('token');

    return {

      headers: new HttpHeaders({

        Authorization: `Bearer ${token}`

      })

    };

  }

  cambiarPassword(datos: any): Observable<any> {

    return this.http.put(

      `${this.api}/password`,

      datos,

      this.getHeaders()

    );

  }

}
