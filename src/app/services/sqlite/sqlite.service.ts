import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

// Servicio base para manejar la base de datos SQLite
@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private dbInstance: SQLiteObject | null = null;

  constructor(private sqlite: SQLite) { }

  // Abre la base de datos (si ya está abierta, no hace nada)
  async openDB() {
    if (!this.dbInstance) {
      this.dbInstance = await this.sqlite.create({
        name: 'mydb.db',
        location: 'default'
      });
    }
  }

  // Método genérico para ejecutar SQL
  async executeSql(query: string, params: any[] = []): Promise<any> {
    await this.openDB();
    if (!this.dbInstance) throw new Error('DB not initialized');
    return this.dbInstance.executeSql(query, params);
  }
}
