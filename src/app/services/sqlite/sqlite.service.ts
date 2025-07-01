import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';


@Injectable({
  providedIn: 'root',
})

// Servicio base para manejar la base de datos SQLite
export class SqliteService {
  private dbInstance: SQLiteObject | null = null;

  // Inyecta el plugin SQLite
  constructor(private sqlite: SQLite) {}

  // Abre la BD
  async openDB() {
    if (!this.dbInstance) {
      this.dbInstance = await this.sqlite.create({
        name: 'mydb.db',
        location: 'default',
      });
    }
  }

  async executeSql(query: string, params: any[] = []): Promise<any> {
    await this.openDB();
    if (!this.dbInstance) throw new Error('DB not initialized');
    return this.dbInstance.executeSql(query, params);
  }
}
