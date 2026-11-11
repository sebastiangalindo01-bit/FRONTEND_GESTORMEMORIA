import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BloqueMemoria } from '../../models/bloque-memoria.model';

@Component({ selector: 'app-visor-memoria', standalone: true, imports: [DecimalPipe], templateUrl: './visor-memoria.component.html', styleUrl: './visor-memoria.component.css' })
export class VisorMemoriaComponent {
  @Input() bloques: BloqueMemoria[] = [];
  get capacidadTotal(): number { return this.bloques.reduce((total, bloque) => total + bloque.tamano, 0); }
  get memoriaLibre(): number { return this.bloques.filter((bloque) => bloque.ocupante === -1).reduce((total, bloque) => total + bloque.tamano, 0); }
  get bloquesLibres(): number { return this.bloques.filter((bloque) => bloque.ocupante === -1).length; }
  get porcentajeOcupado(): number { return this.capacidadTotal === 0 ? 0 : ((this.capacidadTotal - this.memoriaLibre) / this.capacidadTotal) * 100; }
  anchoRelativo(bloque: BloqueMemoria): string { return this.capacidadTotal === 0 ? '0%' : `${(bloque.tamano / this.capacidadTotal) * 100}%`; }
}
