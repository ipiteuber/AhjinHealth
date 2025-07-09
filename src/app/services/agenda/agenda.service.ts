import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError, of } from 'rxjs';
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

  getAgendas(): Observable<Agenda[]> {
    return this.http.get<Agenda[]>(`${this.apiUrl}/agenda`).pipe(
      catchError((err) => {
        if (err.status === 404) {
          return throwError(() => err);
        }
        return throwError(() => err);
      })
    );
  }

  getLocalAgendas(): Agenda[] {
    const data = localStorage.getItem('agendas');
    return data ? JSON.parse(data) : [];
  }

  addAgenda(agenda: Agenda): Observable<Agenda> {
    return this.http.post<Agenda>(`${this.apiUrl}/agenda`, agenda);
  }

  updateAgenda(id: number, agenda: Agenda): Observable<Agenda> {
    return this.http.put<Agenda>(`${this.apiUrl}/agenda/${id}`, agenda);
  }

  deleteAgenda(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/agenda/${id}`);
  }
}
