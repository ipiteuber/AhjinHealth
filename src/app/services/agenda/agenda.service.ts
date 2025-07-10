import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SqliteService } from '../sqlite/sqlite.service';

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

  constructor(private db: SqliteService, private http: HttpClient) {}

  // Crea tabla de agendas
  async createTable() {
    const query = `CREATE TABLE IF NOT EXISTS agendas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medico INTEGER,
      usuario INTEGER,
      fecha TEXT,
      hora TEXT,
      ubicacion TEXT
    )`;
    await this.db.executeSql(query);
  }

  // Agrega cita solo si hay conexion
  addAgenda(agenda: Agenda): Observable<Agenda> {
    if (!navigator.onLine) {
      throw new Error('Sin conexion a internet, no se puede agendar.');
    }
    return this.http.post<Agenda>(`${this.apiUrl}/agenda`, agenda);
  }

  // Actualiza cita
  updateAgenda(id: number, agenda: Agenda): Observable<Agenda> {
    return this.http.put<Agenda>(`${this.apiUrl}/agenda/${id}`, agenda);
  }

  // Elimina cita
  deleteAgenda(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/agenda/${id}`);
  }

  // Obtiene todas las citas del usuario
  getAgendas(usuarioId: number): Observable<Agenda[]> {
    if (!navigator.onLine) {
      // No hay conexion, lanza error o retorna observable vacio segun criterio
      return throwError(() => new Error('Sin conexion a internet'));
    }
  
    return this.http.get<Agenda[]>(`${this.apiUrl}/agenda`).pipe(
      catchError((err) => {
        console.error('Error al obtener agendas desde la API:', err);
        return throwError(() => err);
      })
    );
  }

}

