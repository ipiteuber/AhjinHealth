import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

// Interfaces
export interface Medico {
  id?: number;
  nombre: string;
  especialidad: string;
}

export interface Agenda {
  id?: number;
  medico: number;
  usuario: number;
  fecha: string;
  hora: string;
  ubicacion?: string;
  sincronizado?: boolean;
}

@Injectable({
  providedIn: 'root',
})

// Servicio para manejar la API
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ------- Metodos de Medicos -------

  // Obtener medicos
  getMedicos(): Observable<Medico[]> {
    return this.http.get<Medico[]>(`${this.apiUrl}/medicos`).pipe(
      catchError((error) => {
        console.error('Error obteniendo medicos', error);
        return of([]); // fallback
      })
    );
  }

  // Agregar medico
  addMedico(medico: Medico): Observable<Medico> {
    return this.http.post<Medico>(`${this.apiUrl}/medicos`, medico).pipe(
      catchError((error) => {
        console.error('Error agregando medico', error);
        throw error;
      })
    );
  }

  // Actualizar medico
  updateMedico(id: number, medico: Medico): Observable<Medico> {
    return this.http.put<Medico>(`${this.apiUrl}/medicos/${id}`, medico).pipe(
      catchError((error) => {
        console.error('Error actualizando medico', error);
        throw error;
      })
    );
  }

  // Eliminar medico
  deleteMedico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/medicos/${id}`).pipe(
      catchError((error) => {
        console.error('Error eliminando medico', error);
        throw error;
      })
    );
  }

  
  // ------- Metodos de Agenda -------

  // Obtener agendas
  getAgendas(): Observable<Agenda[]> {
    return this.http.get<Agenda[]>(`${this.apiUrl}/agenda`).pipe(
      catchError((error) => {
        console.error('Error obteniendo agendas', error);
        return of([]); // fallback
      })
    );
  }

  // Agregar agenda
  addAgenda(agenda: Agenda): Observable<Agenda> {
    return this.http.post<Agenda>(`${this.apiUrl}/agenda`, agenda).pipe(
      catchError((error) => {
        console.error('Error agregando agenda', error);
        throw error;
      })
    );
  }

  // Actualizar agenda
  updateAgenda(id: number, agenda: Agenda): Observable<Agenda> {
    return this.http.put<Agenda>(`${this.apiUrl}/agenda/${id}`, agenda).pipe(
      catchError((error) => {
        console.error('Error actualizando agenda', error);
        throw error;
      })
    );
  }

  // Eliminar agenda
  deleteAgenda(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/agenda/${id}`).pipe(
      catchError((error) => {
        console.error('Error eliminando agenda', error);
        throw error;
      })
    );
  }
}
