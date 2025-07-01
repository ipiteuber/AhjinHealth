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

  // Crear tabla usuarios
  async createTable() {
    const query = `CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      email TEXT,
      contrasena TEXT,
      foto TEXT
    )`;
    await this.db.executeSql(query);
  }

  // Agregar usuario
  async addUsuario(usuario: Usuario) {
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
  }

  // Obtener todos los usuarios
  async getUsuarios(): Promise<Usuario[]> {
    const query = 'SELECT * FROM usuarios';
    const res = await this.db.executeSql(query);
    const usuarios: Usuario[] = [];
    for (let i = 0; i < res.rows.length; i++) {
      usuarios.push(res.rows.item(i));
    }
    return usuarios;
  }

  // Actualizar usuario
  async updateUsuario(usuario: Usuario) {
    const query =
      'UPDATE usuarios SET nombre = ?, email = ?, contrasena = ?, foto = ? WHERE id = ?';
    await this.db.executeSql(query, [
      usuario.nombre,
      usuario.email,
      usuario.contrasena,
      usuario.foto || null,
      usuario.id,
    ]);
  }

  // Eliminar usuario
  async deleteUsuario(id: number) {
    const query = 'DELETE FROM usuarios WHERE id = ?';
    await this.db.executeSql(query, [id]);
  }
}
