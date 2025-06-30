import { Injectable } from '@angular/core';
import { SqliteService } from '../sqlite/sqlite.service';

export interface Agenda {
  id?: number;
  medico: number; // id del médico
  usuario: number; // id del usuario
  fecha: string; // formato DD/MM/YYYY
  hora: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  constructor(private db: SqliteService) { }

  // Crear tabla agenda
  async createTable() {
    const query = `CREATE TABLE IF NOT EXISTS agenda (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medico INTEGER,
      usuario INTEGER,
      fecha TEXT,
      hora TEXT
    )`;
    await this.db.executeSql(query);
  }

  // Agregar cita a la agenda
  async addAgenda(agenda: Agenda) {
    const query = 'INSERT INTO agenda (medico, usuario, fecha, hora) VALUES (?, ?, ?, ?)';
    await this.db.executeSql(query, [agenda.medico, agenda.usuario, agenda.fecha, agenda.hora]);
  }

  // Obtener todas las citas
  async getAgendas(): Promise<Agenda[]> {
    const query = 'SELECT * FROM agenda';
    const res = await this.db.executeSql(query);
    const agendas: Agenda[] = [];
    for (let i = 0; i < res.rows.length; i++) {
      agendas.push(res.rows.item(i));
    }
    return agendas;
  }

  // Actualizar cita
  async updateAgenda(agenda: Agenda) {
    const query = 'UPDATE agenda SET medico = ?, usuario = ?, fecha = ?, hora = ? WHERE id = ?';
    await this.db.executeSql(query, [agenda.medico, agenda.usuario, agenda.fecha, agenda.hora, agenda.id]);
  }

  // Eliminar cita
  async deleteAgenda(id: number) {
    const query = 'DELETE FROM agenda WHERE id = ?';
    await this.db.executeSql(query, [id]);
  }
}
