export interface BloqueMemoria {
  inicio: number;
  tamano: number;
  /** -1 indica que el bloque está libre. */
  ocupante: number;
}
