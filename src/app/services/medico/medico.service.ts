import { Injectable } from '@angular/core';
import { SqliteService } from '../sqlite/sqlite.service';
import { NavegadorService } from '../navegador/navegador.service';

export interface Medico {
  id?: number;
  nombre: string;
  especialidad: string;
}

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
  constructor(private db: SqliteService, private navegador: NavegadorService) {}

  // Crear tabla medicos
  async createTable() {
    if (this.navegador.isNavegador()) return; // No crea tabla si es navegador
    const query = `CREATE TABLE IF NOT EXISTS medicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      especialidad TEXT
    )`;
    try {
      await this.db.executeSql(query);
    } catch (error) {
      console.error('Error creando tabla medicos:', error);
      throw error;
    }
  }

  // Agregar medico
  async addMedico(medico: Medico) {
    if (!medico.nombre || !medico.especialidad) {
      throw new Error('Nombre y especialidad son obligatorios');
    }

    // Soporte para navegador
    if (this.navegador.isNavegador()) {
      try {
        const medicos = await this.getMedicos();
        const id = Date.now();
        const nuevo = { id, ...medico };
        medicos.push(nuevo);
        localStorage.setItem('medicos', JSON.stringify(medicos));
        return;
      } catch (error) {
        console.error('Error agregando medico en localStorage:', error);
        throw error;
      }
    }

    // Soporte para SQLite
    try {
      const query = 'INSERT INTO medicos (nombre, especialidad) VALUES (?, ?)';
      await this.db.executeSql(query, [medico.nombre, medico.especialidad]);
    } catch (error) {
      console.error('Error agregando medico en SQLite:', error);
      throw error;
    }
  }

  // Obtener todos los medicos
  async getMedicos(): Promise<Medico[]> {
    // Soporte para navegador
    if (this.navegador.isNavegador()) {
      try {
        const data = localStorage.getItem('medicos');
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.error('Error leyendo medicos de localStorage:', error);
        throw error;
      }
    }

    // Soporte para SQLite
    try {
      const query = 'SELECT * FROM medicos';
      const res = await this.db.executeSql(query);
      const medicos: Medico[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        medicos.push(res.rows.item(i));
      }
      return medicos;
    } catch (error) {
      console.error('Error obteniendo medicos en SQLite:', error);
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

    // Soporte para navegador
    if (this.navegador.isNavegador()) {
      try {
        const medicos = await this.getMedicos();
        const index = medicos.findIndex((m) => m.id === medico.id);
        if (index !== -1) {
          medicos[index] = medico;
          localStorage.setItem('medicos', JSON.stringify(medicos));
        }
      } catch (error) {
        console.error('Error actualizando medico en localStorage:', error);
        throw error;
      }
      return;
    }

    // Soporte para SQLite
    try {
      const query =
        'UPDATE medicos SET nombre = ?, especialidad = ? WHERE id = ?';
      await this.db.executeSql(query, [
        medico.nombre,
        medico.especialidad,
        medico.id,
      ]);
    } catch (error) {
      console.error('Error actualizando medico en SQLite:', error);
      throw error;
    }
  }

  // Eliminar medico
  async deleteMedico(id: number) {
    if (!id) throw new Error('ID de medico requerido para eliminar');

    // Soporte para navegador
    if (this.navegador.isNavegador()) {
      try {
        const medicos = await this.getMedicos();
        const actualizados = medicos.filter((m) => m.id !== id);
        localStorage.setItem('medicos', JSON.stringify(actualizados));
      } catch (error) {
        console.error('Error eliminando medico en localStorage:', error);
        throw error;
      }
      return;
    }

    // Soporte para SQLite
    try {
      const query = 'DELETE FROM medicos WHERE id = ?';
      await this.db.executeSql(query, [id]);
    } catch (error) {
      console.error('Error eliminando medico en SQLite:', error);
      throw error;
    }
  }
}