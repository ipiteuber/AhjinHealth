import { Injectable } from '@angular/core';

import { UsuarioService } from '../usuario/usuario.service';
import { MedicoService } from '../medico/medico.service';
import { AgendaService } from '../agenda/agenda.service';



@Injectable({
  providedIn: 'root'
})
export class DatabaseInitService {
  // Inyecta servicios de usuario y medico para tablas
  constructor(
    private usuarioService: UsuarioService,
    private medicoService: MedicoService,
    private agendaService: AgendaService
  ) {}

  // Metodo inicia BD
  async initDatabase() {
    try {
      // Crea las tablas de usuario y medico si no existen
      const start = performance.now();
      console.log('Iniciando tablas SQLite...');
      await Promise.all([
        this.usuarioService.createTable(),
        this.medicoService.createTable(),
        this.agendaService.createTable()
      ]);
      const end = performance.now();
      console.log('Tablas SQLite iniciadas correctamente en', (end - start).toFixed(2), 'ms');
    } catch (error) {
      console.error('Error al inicializar BD:', error);
    }
  }
}
