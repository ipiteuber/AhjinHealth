import { Injectable } from '@angular/core';
import { SqliteService } from '../sqlite/sqlite.service';

export interface Medico {
  id?: number;
  nombre: string;
  especialidad: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  constructor(private db: SqliteService) { }

  // Crear tabla medicos
  async createTable() {
    const query = `CREATE TABLE IF NOT EXISTS medicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      especialidad TEXT
    )`;
    await this.db.executeSql(query);
  }

  // Agregar medico
  async addMedico(medico: Medico) {
    const query = 'INSERT INTO medicos (nombre, especialidad) VALUES (?, ?)';
    await this.db.executeSql(query, [medico.nombre, medico.especialidad]);
  }

  // Obtener todos los medicos
  async getMedicos(): Promise<Medico[]> {
    const query = 'SELECT * FROM medicos';
    const res = await this.db.executeSql(query);
    const medicos: Medico[] = [];
    for (let i = 0; i < res.rows.length; i++) {
      medicos.push(res.rows.item(i));
    }
    return medicos;
  }

  // Actualizar medico
  async updateMedico(medico: Medico) {
    const query = 'UPDATE medicos SET nombre = ?, especialidad = ? WHERE id = ?';
    await this.db.executeSql(query, [medico.nombre, medico.especialidad, medico.id]);
  }

  // Eliminar medico
  async deleteMedico(id: number) {
    const query = 'DELETE FROM medicos WHERE id = ?';
    await this.db.executeSql(query, [id]);
  }
}
