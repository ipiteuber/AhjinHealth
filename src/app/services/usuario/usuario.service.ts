import { Injectable } from '@angular/core';
import { SqliteService } from '../sqlite/sqlite.service';

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  contrasena: string;
  foto?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private db: SqliteService) {}

  // Crea tabla usuarios
  async createTable() {
    const query = `CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      email TEXT UNIQUE,
      contrasena TEXT,
      foto TEXT
    )`; // Debe tener email unico
    await this.db.executeSql(query);
  }

  // Agregar usuario
  async addUsuario(usuario: Usuario) {
    if (!usuario.nombre || !usuario.email || !usuario.contrasena) {
      throw new Error('Faltan campos obligatorios');
    }

    try {
      const query =
        'INSERT INTO usuarios (nombre, email, contrasena, foto) VALUES (?, ?, ?, ?)';
      const res = await this.db.executeSql(query, [
        usuario.nombre,
        usuario.email,
        usuario.contrasena,
        usuario.foto || null,
      ]);

      // Recupera el id creado para usuario
      const id = res.insertId;
      return { id, ...usuario };
    } catch (error) {
      console.error('Error agregando usuario:', error);
      throw error;
    }
  }

  // Obtener usuario por email
  async getUsuarioByEmail(email: string): Promise<Usuario | null> {
    try {
      const query = 'SELECT * FROM usuarios WHERE email = ?';
      const res = await this.db.executeSql(query, [email]);
      if (res.rows.length > 0) {
        return res.rows.item(0);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error obteniendo usuario por email:', error);
      throw error;
    }
  }

  // Actualizar usuario
  async updateUsuario(usuario: Usuario) {
    if (!usuario.id) {
      throw new Error('ID de usuario requerido para actualizar');
    }
    try {
      const query =
        'UPDATE usuarios SET nombre = ?, email = ?, contrasena = ?, foto = ? WHERE id = ?';
      await this.db.executeSql(query, [
        usuario.nombre,
        usuario.email,
        usuario.contrasena,
        usuario.foto || null,
        usuario.id,
      ]);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  }

  // Eliminar usuario
  async deleteUsuario(id: number) {
    if (!id) throw new Error('ID de usuario requerido para eliminar');
    try {
      const query = 'DELETE FROM usuarios WHERE id = ?';
      await this.db.executeSql(query, [id]);
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  }

  // Obtener todos los usuarios
  async getUsuarios(): Promise<Usuario[]> {
    try {
      const query = 'SELECT * FROM usuarios';
      const res = await this.db.executeSql(query);
      const usuarios: Usuario[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        usuarios.push(res.rows.item(i));
      }
      return usuarios;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  }

  // Guardar usuario actual en localStorage
  setUsuarioLocal(usuario: Usuario) {
    try {
      localStorage.setItem('usuarioActual', JSON.stringify(usuario));
    } catch (error) {
      console.error('Error guardando usuario en localStorage:', error);
    }
  }

  // Obtener usuario actual desde localStorage
  getUsuarioLocal(): Usuario | null {
    const data = localStorage.getItem('usuarioActual');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      console.error('Error parseando usuario localStorage');
      return null;
    }
  }

  // Eliminar usuario actual de localStorage (logout)
  removeUsuarioLocal() {
    localStorage.removeItem('usuarioActual');
  }
}
