import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operacion } from '../models/operacion.model';

const API = '/api';

export interface SecuenciaResponse {
  id: number;
  nombre: string;
  semilla: number | null;
  total: number;
  operaciones: { orden: number; tipo: 'ASIGNAR' | 'LIBERAR'; proceso: number; tamano: number | null }[];
}

export interface CrearSecuenciaRequest { nombre: string; operaciones: Operacion[]; }
export interface MapaRequest { nombre: string; bloques: { inicio: number; tamano: number }[]; }
export interface MapaResponse extends MapaRequest { id: number; }
export interface DecisionOperacion {
  posicion: number; tipo: string; procesoId: number; tamanoSolicitado: number;
  aceptada: boolean; causaRechazo: string | null; libreTotal: number;
  numeroHuecos: number; huecoMayor: number; mensaje: string;
}
export interface SimulacionResultado {
  estrategia: string; codigoRetorno: number; estado: string; mensaje: string;
  mapaFinal: { inicio: number; tamano: number; procesoId: number; libre: boolean }[];
  causasRechazo: number[]; decisiones: DecisionOperacion[];
  fragmentacionInterna: number; fragmentacionExterna: number; huecoMayor: number;
}
export interface CorridaResponse {
  id: number; mapaId: number; secuenciaId: number; estrategia: string;
  propietario: string; creadaEn: string; resultado: SimulacionResultado;
}

@Injectable({ providedIn: 'root' })
export class SecuenciaService {
  private http = inject(HttpClient);

  crearSecuencia(request: CrearSecuenciaRequest): Observable<SecuenciaResponse> {
    const operaciones = request.operaciones.map(op => ({
      tipo: op.tipo,
      proceso: Number(op.procesoId),
      tamano: op.tipo === 'ASIGNAR' ? op.tamanoKb : null
    }));
    return this.http.post<SecuenciaResponse>(`${API}/secuencias`, { nombre: request.nombre, semilla: null, operaciones });
  }
  obtenerSecuencia(id: number): Observable<SecuenciaResponse> { return this.http.get<SecuenciaResponse>(`${API}/secuencias/${id}`); }
  listarSecuencias(): Observable<SecuenciaResponse[]> { return this.http.get<SecuenciaResponse[]>(`${API}/secuencias`); }
  crearMapa(request: MapaRequest): Observable<MapaResponse> { return this.http.post<MapaResponse>(`${API}/mapas`, request); }
  listarMapas(): Observable<MapaResponse[]> { return this.http.get<MapaResponse[]>(`${API}/mapas`); }
  ejecutar(mapaId: number, secuenciaId: number, estrategias: number[]): Observable<CorridaResponse[]> {
    return this.http.post<CorridaResponse[]>(`${API}/corridas`, { mapaId, secuenciaId, estrategias });
  }
  historial(): Observable<CorridaResponse[]> { return this.http.get<CorridaResponse[]>(`${API}/corridas`); }
  obtenerCorrida(id: number): Observable<CorridaResponse> { return this.http.get<CorridaResponse>(`${API}/corridas/${id}`); }
}
