import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { NavegadorService } from '../navegador/navegador.service';

@Injectable({
  providedIn: 'root',
})

// Servicio base para manejar la base de datos SQLite con soporte navegador
export class SqliteService {
  private dbInstance: SQLiteObject | null = null;

  // Inyecta plugin SQLite y servicio navegador
  constructor(private sqlite: SQLite, private navegador: NavegadorService) {}

  // Abre BD solo si no es navegador
  async openDB() {
    // Si esta en navegador no abre DB real
    if (this.navegador.isNavegador()) {
      return;
    }
    if (!this.dbInstance) {
      this.dbInstance = await this.sqlite.create({
        name: 'mydb.db',
        location: 'default',
      });
    }
  }

  // Ejecuta query SQL, o simula en navegador
  async executeSql(query: string, params: any[] = []): Promise<any> {
    // Si es navegador lo simula
    if (this.navegador.isNavegador()) {
      // Para evitar errores en navegador, retorna resultado simulado
      return new Promise((resolve) => {
        resolve({
          rows: {
            length: 0,
            item: (_i: number) => null,
          },
          insertId: undefined,
        });
      });
    }

    // Si no es navegador, abre DB y ejecuta query
    await this.openDB();
    if (!this.dbInstance) throw new Error('DB not initialized');
    return this.dbInstance.executeSql(query, params);
  }
}
