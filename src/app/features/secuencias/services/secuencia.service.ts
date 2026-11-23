
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Operacion } from '../models/operacion.model';

export interface SecuenciaResponse {
  id: number;
  nombre: string;
  operaciones: OperacionResponse[];
}

export interface OperacionResponse {
  posicion: number;
  tipo: 'ASIGNAR' | 'LIBERAR';
  procesoId: string;
  tamanoKb: number | null;
}

export interface CrearSecuenciaRequest {
  nombre: string;
  operaciones: Operacion[];
}

@Injectable({
  providedIn: 'root'
})
export class SecuenciaService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/secuencias';

  crearSecuencia(
    request: CrearSecuenciaRequest
  ): Observable<SecuenciaResponse> {
    return this.http.post<SecuenciaResponse>(
      this.apiUrl,
      request
    );
  }

  obtenerSecuencia(id: number): Observable<SecuenciaResponse> {
    return this.http.get<SecuenciaResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}
