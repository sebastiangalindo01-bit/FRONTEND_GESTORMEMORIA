// Asigna una operacion
export interface AsignarOperacion {
  tipo: 'ASIGNAR';
  procesoId: string;
  tamanoKb: number;
}

// Libera una operacion
export interface LiberarOperacion {
  tipo: 'LIBERAR';
  procesoId: string;
}

export type Operacion = AsignarOperacion | LiberarOperacion;
