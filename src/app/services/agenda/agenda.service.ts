import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError, firstValueFrom, from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SqliteService } from '../sqlite/sqlite.service';
import { NavegadorService } from '../navegador/navegador.service';

export interface Agenda {
  id?: number;
  medico: number;
  usuario: number;
  fecha: string;
  hora: string;
  ubicacion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AgendaService {
  private apiUrl = environment.apiUrl;

  constructor(
    private db: SqliteService,
    private http: HttpClient,
    private navegador: NavegadorService
  ) {}

  // Crea tabla de agendas
  async createTable() {
    if (this.navegador.isNavegador()) return; // No crea tabla si es navegador
    const query = `CREATE TABLE IF NOT EXISTS agendas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medico INTEGER,
      usuario INTEGER,
      fecha TEXT,
      hora TEXT,
      ubicacion TEXT
    )`;
    try {
      await this.db.executeSql(query);
    } catch (error) {
      console.error('Error creando tabla agendas:', error);
      throw error;
    }
  }

  // Agrega cita solo si hay conexion
  addAgenda(agenda: Agenda): Observable<Agenda> {
    if (!navigator.onLine) {
      throw new Error('Sin conexion a internet, no se puede agendar.');
    }
    return this.http.post<Agenda>(`${this.apiUrl}/agenda`, agenda);
  }

  // Actualiza cita
  async updateAgenda(id: number, agenda: Agenda): Promise<void> {
    // En navegador actualiza localStorage
    if (this.navegador.isNavegador()) {
      const agendas = await this.getAgendasLocal();
      const index = agendas.findIndex((a) => a.id === id);
      if (index !== -1) {
        agendas[index] = { id, ...agenda };
        localStorage.setItem('agendas', JSON.stringify(agendas));
      }
      return;
    }

    // En SQLite o API
    try {
      await firstValueFrom(
        this.http.put<Agenda>(`${this.apiUrl}/agenda/${id}`, agenda)
      );
    } catch (error) {
      console.error('Error actualizando agenda en API:', error);
      throw error;
    }
  }

  // Elimina cita
  async deleteAgenda(id: number): Promise<void> {
    // En navegador elimina en localStorage
    if (this.navegador.isNavegador()) {
      const agendas = await this.getAgendasLocal();
      const nuevas = agendas.filter((a) => a.id !== id);
      localStorage.setItem('agendas', JSON.stringify(nuevas));
      return;
    }

    // En SQLite o API
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/agenda/${id}`));
    } catch (error) {
      console.error('Error eliminando agenda en API:', error);
      throw error;
    }
  }

  // Obtener citas
  getAgendas(usuarioId?: number): Observable<Agenda[]> {
    // Soporte para navegador
    if (this.navegador.isNavegador()) {
      return from(this.getAgendasLocal(usuarioId)).pipe(
        catchError((err) => {
          console.error('Error obteniendo agenda local:', err);
          return of([]);
        })
      );
    }

    // Si no hay conexion retorna error
    if (!navigator.onLine) {
      return throwError(() => new Error('Sin conexion a internet'));
    }

    // Soporte para SQLite o API
    if (usuarioId) {
      return this.http
        .get<Agenda[]>(`${this.apiUrl}/agenda?usuario=${usuarioId}`)
        .pipe(
          catchError((err) => {
            console.error('Error al obtener agendas desde la API:', err);
            return throwError(() => err);
          })
        );
    }

    // Obtener todas las agendas
    return this.http.get<Agenda[]>(`${this.apiUrl}/agenda`).pipe(
      catchError((err) => {
        console.error('Error al obtener agendas desde la API:', err);
        return throwError(() => err);
      })
    );
  }

  // Agendas locales
  private async getAgendasLocal(usuarioId?: number): Promise<Agenda[]> {
    try {
      const data = localStorage.getItem('agendas');
      if (!data) return [];
      const agendas = JSON.parse(data);
      if (usuarioId) {
        return agendas.filter((a: Agenda) => a.usuario === usuarioId);
      }
      return agendas;
    } catch (error) {
      console.error('Error leyendo agendas de localStorage:', error);
      return [];
    }
  }

  isNavegador(): boolean {
    return this.navegador.isNavegador();
  }
}
