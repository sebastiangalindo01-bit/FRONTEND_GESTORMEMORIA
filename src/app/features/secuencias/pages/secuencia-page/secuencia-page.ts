
import { Component, inject, signal } from '@angular/core';

import { Operacion } from '../../models/operacion.model';
import { OperacionForm } from '../../components/operacion-form/operacion-form';
import { SecuenciaList } from '../../components/secuencia-list/secuencia-list';
import { SecuenciaService } from '../../services/secuencia.service';

@Component({
  selector: 'app-secuencia-page',
  standalone: true,
  imports: [OperacionForm, SecuenciaList],
  templateUrl: './secuencia-page.html',
  styleUrl: './secuencia-page.css'
})
export class SecuenciasPage {

  private secuenciaService = inject(SecuenciaService);

  operaciones = signal<Operacion[]>([]);
  nombreSecuencia = signal('');

  idSecuencia = signal(2);
  cargando = signal(false);
  guardando = signal(false);
  mensaje = signal('');

  agregarOperacion(operacion: Operacion): void {
    this.operaciones.update(actuales => [
      ...actuales,
      operacion
    ]);
  }

  guardarSecuencia(): void {

    if (!this.nombreSecuencia().trim()) {
      this.mensaje.set('Debes ingresar un nombre para la secuencia.');
      return;
    }

    if (this.operaciones().length === 0) {
      this.mensaje.set('Debes registrar al menos una operación.');
      return;
    }

    this.guardando.set(true);
    this.mensaje.set('');

    this.secuenciaService.crearSecuencia({
      nombre: this.nombreSecuencia().trim(),
      operaciones: this.operaciones()
    }).subscribe({

      next: (respuesta) => {
        this.mensaje.set(
          `Secuencia guardada correctamente. ID generado: ${respuesta.id}`
        );

        this.idSecuencia.set(respuesta.id);
        this.guardando.set(false);
      },

      error: (error) => {
        console.error('Error al guardar:', error);

        this.mensaje.set(
          'No fue posible guardar la secuencia.'
        );

        this.guardando.set(false);
      }
    });
  }

  cargarSecuencia(): void {

    this.cargando.set(true);
    this.mensaje.set('');

    this.secuenciaService.obtenerSecuencia(this.idSecuencia()).subscribe({

      next: (respuesta) => {

        const operacionesConvertidas: Operacion[] =
          respuesta.operaciones.map(operacion => {

            if (operacion.tipo === 'ASIGNAR') {
              return {
                tipo: 'ASIGNAR',
                procesoId: operacion.procesoId,
                tamanoKb: operacion.tamanoKb!
              };
            }

            return {
              tipo: 'LIBERAR',
              procesoId: operacion.procesoId
            };
          });

        this.operaciones.set(operacionesConvertidas);
        this.nombreSecuencia.set(respuesta.nombre);

        this.mensaje.set(
          `Secuencia "${respuesta.nombre}" cargada correctamente.`
        );

        this.cargando.set(false);
      },

      error: (error) => {
        console.error('Error al consultar:', error);

        this.mensaje.set(
          'No se pudo cargar la secuencia.'
        );

        this.cargando.set(false);
      }
    });
  }
}
