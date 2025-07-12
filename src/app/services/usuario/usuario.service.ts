import { Injectable } from '@angular/core';
import { SqliteService } from '../sqlite/sqlite.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NavegadorService } from '../navegador/navegador.service';

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
  constructor(
    private db: SqliteService,
    private http: HttpClient,
    private navegador: NavegadorService
  ) {}

  private apiUrl = environment.apiUrl; // URL base de la API

  // Crea tabla usuarios
  async createTable() {
    if (this.navegador.isNavegador()) return; // No crea tabla si es navegador
    const query = `CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      email TEXT UNIQUE,
      contrasena TEXT,
      foto TEXT
    )`; // Debe tener email unico
    try {
      await this.db.executeSql(query);
    } catch (error) {
      console.error('Error creando tabla usuarios:', error);
      throw error;
    }
  }

  // Agregar usuario
  async addUsuario(usuario: Usuario) {
    if (!usuario.nombre || !usuario.email || !usuario.contrasena) {
      throw new Error('Faltan campos obligatorios');
    }

    // Soporte para navegador
    if (this.navegador.isNavegador()) {
      try {
        const usuarios = await this.getUsuarios();
        const id = Date.now();
        const nuevo = { id, ...usuario };
        usuarios.push(nuevo);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        return nuevo;
      } catch (error) {
        console.error('Error agregando usuario en localStorage:', error);
        throw error;
      }
    }

    // Soporte para SQLite
    try {
      const query =
        'INSERT INTO usuarios (nombre, email, contrasena, foto) VALUES (?, ?, ?, ?)';
      const res = await this.db.executeSql(query, [
        usuario.nombre,
        usuario.email,
        usuario.contrasena,
        usuario.foto || null,
      ]);
      const id = res.insertId;
      return { id, ...usuario };
    } catch (error) {
      console.error('Error agregando usuario en SQLite:', error);
      throw error;
    }
  }

  // Obtener usuario por email
  async getUsuarioByEmail(email: string): Promise<Usuario | null> {
    if (!email) throw new Error('Email es requerido para buscar usuario');

    // Soporte para navegador
    if (this.navegador.isNavegador()) {
      try {
        const usuarios = await this.getUsuarios();
        return usuarios.find((u) => u.email === email) || null;
      } catch (error) {
        console.error(
          'Error obteniendo usuario por email en localStorage:',
          error
        );
        throw error;
      }
    }

    // Soporte para SQLite
    try {
      const query = 'SELECT * FROM usuarios WHERE email = ?';
      const res = await this.db.executeSql(query, [email]);
      if (res.rows.length > 0) {
        return res.rows.item(0);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error obteniendo usuario por email en SQLite:', error);
      throw error;
    }
  }

  // Actualizar usuario
  async updateUsuario(usuario: Usuario) {
    if (!usuario.id) {
      throw new Error('ID de usuario requerido para actualizar');
    }

    // Soporte para navegador
    if (this.navegador.isNavegador()) {
      try {
        const usuarios = await this.getUsuarios();
        const index = usuarios.findIndex((u) => u.id === usuario.id);
        if (index !== -1) {
          usuarios[index] = usuario;
          localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }
      } catch (error) {
        console.error('Error actualizando usuario en localStorage:', error);
        throw error;
      }
      return;
    }

    // Soporte para SQLite
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
      console.error('Error actualizando usuario en SQLite:', error);
      throw error;
    }
  }

  // Eliminar usuario
  async deleteUsuario(id: number) {
    if (!id) throw new Error('ID de usuario requerido para eliminar');

    // Soporte para navegador
    if (this.navegador.isNavegador()) {
      try {
        const usuarios = await this.getUsuarios();
        const actualizados = usuarios.filter((u) => u.id !== id);
        localStorage.setItem('usuarios', JSON.stringify(actualizados));
      } catch (error) {
        console.error('Error eliminando usuario en localStorage:', error);
        throw error;
      }
      return;
    }

    // Soporte para SQLite
    try {
      const query = 'DELETE FROM usuarios WHERE id = ?';
      await this.db.executeSql(query, [id]);
    } catch (error) {
      console.error('Error eliminando usuario en SQLite:', error);
      throw error;
    }
  }

  // Obtener todos los usuarios
  async getUsuarios(): Promise<Usuario[]> {
    // Soporte para navegador
    if (this.navegador.isNavegador()) {
      try {
        const data = localStorage.getItem('usuarios');
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.error('Error leyendo usuarios de localStorage:', error);
        throw error;
      }
    }

    // Soporte para SQLite
    try {
      const query = 'SELECT * FROM usuarios';
      const res = await this.db.executeSql(query);
      const usuarios: Usuario[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        usuarios.push(res.rows.item(i));
      }
      return usuarios;
    } catch (error) {
      console.error('Error obteniendo usuarios en SQLite:', error);
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
      console.error(
        'Error parseando usuario localStorage, se eliminara entrada corrupta.'
      );
      this.removeUsuarioLocal();
      return null;
    }
  }

  // Eliminar usuario actual de localStorage (logout)
  removeUsuarioLocal() {
    localStorage.removeItem('usuarioActual');
  }

  // Sincronizar usuario con API
  syncUsuarioConAPI(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, usuario).pipe(
      catchError((err) => {
        console.error('Error al sincronizar usuario con API:', err);
        return of(null);
      })
    );
  }

  // Sincronizar usuarios pendientes con API
  async syncUsuariosPendientes(): Promise<void> {
    const usuarios = await this.getUsuarios();
    for (const usuario of usuarios) {
      this.syncUsuarioConAPI(usuario).subscribe();
    }
  }
}
