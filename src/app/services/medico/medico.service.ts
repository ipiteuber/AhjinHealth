import { Injectable } from '@angular/core';
import { SqliteService } from '../sqlite/sqlite.service';

export interface Medico {
  id?: number;
  nombre: string;
  especialidad: string;
}

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
  constructor(private db: SqliteService) {}

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
    if (!medico.nombre || !medico.especialidad) {
      throw new Error('Nombre y especialidad son obligatorios');
    }
    try {
      const query = 'INSERT INTO medicos (nombre, especialidad) VALUES (?, ?)';
      await this.db.executeSql(query, [medico.nombre, medico.especialidad]);
    } catch (error) {
      console.error('Error agregando medico en API:', error);
      throw error;
    }
  }

  // Obtener todos los medicos
  async getMedicos(): Promise<Medico[]> {
    try {
      const query = 'SELECT * FROM medicos';
      const res = await this.db.executeSql(query);
      const medicos: Medico[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        medicos.push(res.rows.item(i));
      }
      return medicos;
    } catch (error) {
      console.error('Error obteniendo medicos en API:', error);
      throw error;
    }
  }

  // Actualizar medico
  async updateMedico(medico: Medico) {
    if (!medico.id) {
      throw new Error('ID de medico requerido para actualizar');
    }
    if (!medico.nombre || !medico.especialidad) {
      throw new Error('Nombre y especialidad son obligatorios');
    }
    try {
      const query =
        'UPDATE medicos SET nombre = ?, especialidad = ? WHERE id = ?';
      await this.db.executeSql(query, [
        medico.nombre,
        medico.especialidad,
        medico.id,
      ]);
    } catch (error) {
      console.error('Error actualizando medico:', error);
      throw error;
    }
  }

  // Eliminar medico
  async deleteMedico(id: number) {
    if (!id) throw new Error('ID de medico requerido para eliminar');
    try {
      const query = 'DELETE FROM medicos WHERE id = ?';
      await this.db.executeSql(query, [id]);
    } catch (error) {
      console.error('Error eliminando medico:', error);
      throw error;
    }
  }
}