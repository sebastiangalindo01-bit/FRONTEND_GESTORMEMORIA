import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { Operacion } from '../../models/operacion.model';
import { OperacionForm } from '../../components/operacion-form/operacion-form';
import { SecuenciaList } from '../../components/secuencia-list/secuencia-list';
import { CorridaResponse, DecisionOperacion, MapaResponse, SecuenciaResponse, SecuenciaService } from '../../services/secuencia.service';

@Component({
  selector: 'app-secuencia-page', standalone: true, imports: [DatePipe, OperacionForm, SecuenciaList],
  templateUrl: './secuencia-page.html', styleUrl: './secuencia-page.css'
})
export class SecuenciasPage implements OnInit {
  private api = inject(SecuenciaService);
  private keycloak = inject(KeycloakService, { optional: true });
  operaciones = signal<Operacion[]>([]);
  nombreSecuencia = signal('');
  idSecuencia = signal<number | null>(null);
  mapas = signal<MapaResponse[]>([]);
  nombreMapa = signal('');
  bloques = signal([{ inicio: 0, tamano: 100 }, { inicio: 100, tamano: 500 }, { inicio: 600, tamano: 200 }, { inicio: 800, tamano: 300 }]);
  mapaSeleccionado = signal<number | null>(null);
  corridas = signal<CorridaResponse[]>([]);
  historial = signal<CorridaResponse[]>([]);
  cargando = signal(false);
  guardando = signal(false);
  ejecutando = signal(false);
  mensaje = signal('');

  ngOnInit(): void {
    this.cargarMapas();
    this.cargarHistorial();
  }

  agregarOperacion(op: Operacion): void { this.operaciones.update(actuales => [...actuales, op]); }
  quitarOperacion(index: number): void { this.operaciones.update(ops => ops.filter((_, i) => i !== index)); }
  agregarBloque(): void {
    const bloques = this.bloques();
    const anterior = bloques.at(-1);
    this.bloques.set([...bloques, { inicio: anterior ? anterior.inicio + anterior.tamano : 0, tamano: 100 }]);
  }
  quitarBloque(index: number): void { this.bloques.update(b => b.filter((_, i) => i !== index)); }
  actualizarBloque(index: number, campo: 'inicio' | 'tamano', valor: number): void {
    this.bloques.update(lista => lista.map((b, i) => i === index ? { ...b, [campo]: valor } : b));
  }

  guardarMapa(): void {
    if (!this.nombreMapa().trim() || !this.bloques().length) { this.mensaje.set('Escribe un nombre y agrega al menos un bloque.'); return; }
    this.guardando.set(true); this.mensaje.set('');
    this.api.crearMapa({ nombre: this.nombreMapa().trim(), bloques: this.bloques() }).subscribe({
      next: mapa => { this.mapas.update(ms => [...ms, mapa]); this.mapaSeleccionado.set(mapa.id); this.mensaje.set(`Mapa “${mapa.nombre}” guardado.`); this.guardando.set(false); },
      error: e => { this.mensaje.set(e.error?.mensaje ?? 'No se pudo guardar el mapa. Comprueba que los bloques formen una secuencia contigua.'); this.guardando.set(false); }
    });
  }
  cargarMapas(): void {
    this.api.listarMapas().subscribe({ next: mapas => { this.mapas.set(mapas); if (mapas.length && this.mapaSeleccionado() === null) this.mapaSeleccionado.set(mapas[0].id); }, error: () => this.mensaje.set('No se pudieron cargar los mapas.') });
  }
  guardarSecuencia(): void {
    if (!this.nombreSecuencia().trim() || !this.operaciones().length) { this.mensaje.set('Escribe un nombre y registra al menos una operación.'); return; }
    if (this.operaciones().some(op => !Number.isInteger(Number(op.procesoId)) || Number(op.procesoId) < 0)) { this.mensaje.set('Los identificadores de proceso deben ser números enteros no negativos.'); return; }
    this.guardando.set(true); this.mensaje.set('');
    this.api.crearSecuencia({ nombre: this.nombreSecuencia().trim(), operaciones: this.operaciones() }).subscribe({
      next: s => { this.idSecuencia.set(s.id); this.mensaje.set(`Secuencia guardada con ID ${s.id}.`); this.guardando.set(false); },
      error: e => { this.mensaje.set(e.error?.mensaje ?? 'No se pudo guardar la secuencia.'); this.guardando.set(false); }
    });
  }
  cargarSecuencia(): void {
    const id = this.idSecuencia(); if (!id) { this.mensaje.set('Escribe el ID de una secuencia guardada.'); return; }
    this.cargando.set(true); this.mensaje.set('');
    this.api.obtenerSecuencia(id).subscribe({
      next: s => { this.aplicarSecuencia(s); this.mensaje.set(`Secuencia “${s.nombre}” cargada.`); this.cargando.set(false); },
      error: () => { this.mensaje.set('No se encontró esa secuencia o no tienes acceso.'); this.cargando.set(false); }
    });
  }
  private aplicarSecuencia(s: SecuenciaResponse): void {
    this.nombreSecuencia.set(s.nombre); this.idSecuencia.set(s.id);
    this.operaciones.set(s.operaciones.map(op => op.tipo === 'ASIGNAR'
      ? { tipo: 'ASIGNAR', procesoId: String(op.proceso), tamanoKb: op.tamano ?? 0 }
      : { tipo: 'LIBERAR', procesoId: String(op.proceso) }));
  }
  ejecutarComparacion(): void {
    const mapa = this.mapaSeleccionado(), secuencia = this.idSecuencia();
    if (!mapa || !secuencia) { this.mensaje.set('Selecciona un mapa y guarda o carga una secuencia antes de ejecutar.'); return; }
    this.ejecutando.set(true); this.mensaje.set('');
    this.api.ejecutar(mapa, secuencia, [0, 1, 2, 3]).subscribe({
      next: rs => { this.corridas.set(rs); this.cargarHistorial(); this.mensaje.set('Comparación completada para todas las estrategias seleccionadas.'); this.ejecutando.set(false); },
      error: e => { this.mensaje.set(e.error?.mensaje ?? 'No fue posible ejecutar la simulación. Revisa la disponibilidad del asignador.'); this.ejecutando.set(false); }
    });
  }
  cargarHistorial(): void { this.api.historial().subscribe({ next: h => this.historial.set(h), error: () => undefined }); }
  menorFragmentacion(rs: CorridaResponse[]): string {
    const mejor = [...rs].sort((a, b) => a.resultado.fragmentacionExterna - b.resultado.fragmentacionExterna)[0];
    return mejor?.estrategia ?? '';
  }
  totalLibre(corrida: CorridaResponse): number {
    return corrida.resultado.mapaFinal.filter(b => b.libre || b.procesoId === -1).reduce((total, b) => total + b.tamano, 0);
  }
  atendidas(corrida: CorridaResponse): number {
    return corrida.resultado.decisiones.filter(d => d.aceptada && d.tipo === 'ASIGNAR').length;
  }
  rechazadas(corrida: CorridaResponse): DecisionOperacion[] {
    return corrida.resultado.decisiones.filter(d => !d.aceptada);
  }
  apiObtener(id: number): void {
    this.api.obtenerCorrida(id).subscribe({ next: corrida => this.corridas.set([corrida]), error: () => this.mensaje.set('No se pudo cargar esa corrida.') });
  }
  etiqueta(estrategia: string): string {
    return ({ '0': 'Primer ajuste', '1': 'Mejor ajuste', '2': 'Peor ajuste', '3': 'Siguiente ajuste' } as Record<string, string>)[estrategia] ?? estrategia;
  }
  salir(): void { void this.keycloak?.logout(window.location.origin); }
}
