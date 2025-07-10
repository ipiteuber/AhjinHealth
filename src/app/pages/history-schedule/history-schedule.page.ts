import { Component, OnInit } from '@angular/core';
import { AgendaService, Agenda } from 'src/app/services/agenda/agenda.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-history-schedule',
  templateUrl: './history-schedule.page.html',
  styleUrls: ['./history-schedule.page.scss'],
  standalone: false,
})
export class HistorySchedulePage implements OnInit {
  historial: Agenda[] = [];
  loading = true;
  error = '';
  usandoDatosLocales = false;

  constructor(
    private agendaService: AgendaService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.loading = true;
    this.error = '';
    this.usandoDatosLocales = false;

    // Obtener usuario actual
    const usuario = this.usuarioService.getUsuarioLocal();
    
    if (!usuario || !usuario.id) {
      this.error = 'Usuario no encontrado. Por favor, inicia sesion nuevamente.';
      this.loading = false;
      return;
    }

    this.agendaService.getAgendas(usuario.id).subscribe({
      next: (data) => {
        this.historial = data;
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.historial = this.agendaService.getLocalAgendas();
          this.usandoDatosLocales = true;
          this.loading = false;
        } else {
          this.error = 'No se pudo cargar el historial.';
          this.loading = false;
        }
      },
    });
  }
}
