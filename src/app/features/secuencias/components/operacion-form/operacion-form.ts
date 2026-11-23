
import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Operacion } from '../../models/operacion.model';

@Component({
  selector: 'app-operacion-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './operacion-form.html',
  styleUrl: './operacion-form.css'
})
export class OperacionForm {

  tipoOperacion = signal<'ASIGNAR' | 'LIBERAR'>('ASIGNAR');
  procesoId = signal('');
  tamanoKb = signal<number | null>(null);

  operacionRegistrada = output<Operacion>();

  registrarOperacion(): void {
    const proceso = this.procesoId().trim();

    if (!proceso) {
      return;
    }

    if (this.tipoOperacion() === 'ASIGNAR') {
      const tamano = this.tamanoKb();

      if (tamano === null || !Number.isFinite(tamano) || tamano <= 0) {
        return;
      }

      this.operacionRegistrada.emit({
        tipo: 'ASIGNAR',
        procesoId: proceso,
        tamanoKb: tamano
      });
    } else {
      this.operacionRegistrada.emit({
        tipo: 'LIBERAR',
        procesoId: proceso
      });
    }

    this.procesoId.set('');
    this.tamanoKb.set(null);
  }
}
