import { TestBed } from '@angular/core/testing';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { SQLiteMock } from 'src/app/mocks/sqlite.mock';

export function setupSQLiteMock() {
  TestBed.overrideProvider(SQLite, { useValue: new SQLiteMock() });
}