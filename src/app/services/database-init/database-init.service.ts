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
      await Promise.all([
        this.usuarioService.createTable(),
        this.medicoService.createTable(),
        this.agendaService.createTable()
      ]);
      console.log('Tablas SQLite iniciadas correctamente');
    } catch (error) {
      console.error('Error al inicializar BD:', error);
    }
  }
}
