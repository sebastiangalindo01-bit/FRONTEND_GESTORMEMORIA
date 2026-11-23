
import { Component, input } from '@angular/core';
import { Operacion } from '../../models/operacion.model';

@Component({
  selector: 'app-secuencia-list',
  standalone: true,
  imports: [],
  templateUrl: './secuencia-list.html',
  styleUrl: './secuencia-list.css'
})
export class SecuenciaList {

  operaciones = input.required<Operacion[]>();

}
