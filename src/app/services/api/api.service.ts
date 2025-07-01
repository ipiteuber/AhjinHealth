import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

// Servicio para manejar la API
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Metodos de medicos
  // Obtener medicos
  getMedicos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medicos`);
  }

  // Agregar medico
  addMedico(medico: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/medicos`, medico);
  }

  // Actualizar medico
  updateMedico(id: number, medico: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/medicos/${id}`, medico);
  }

  // Eliminar medico
  deleteMedico(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/medicos/${id}`);
  }


  
  // Metodos de agenda
  // Obtener citas
  getAgendas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/agenda`);
  }

  // Agregar cita
  addAgenda(agenda: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/agenda`, agenda);
  }

  // Actualizar cita
  updateAgenda(id: number, agenda: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/agenda/${id}`, agenda);
  }
  
  // Eliminar cita
  deleteAgenda(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/agenda/${id}`);
  }

}
