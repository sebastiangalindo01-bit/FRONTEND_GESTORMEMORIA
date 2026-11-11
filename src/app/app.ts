import { Component } from '@angular/core';
import { VisorMemoriaComponent } from './components/visor-memoria/visor-memoria.component';
import { BloqueMemoria } from './models/bloque-memoria.model';

@Component({
  imports: [VisorMemoriaComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly mock: BloqueMemoria[] = [
    { inicio: 0, tamano: 100, ocupante: 1 },
    { inicio: 100, tamano: 40, ocupante: -1 },
    { inicio: 140, tamano: 200, ocupante: 3 },
    { inicio: 340, tamano: 60, ocupante: -1 },
    { inicio: 400, tamano: 100, ocupante: 7 },
  ];
}
