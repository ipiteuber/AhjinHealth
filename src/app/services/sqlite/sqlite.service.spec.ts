import { TestBed } from '@angular/core/testing';
import { SqliteService } from './sqlite.service';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { NavegadorService } from '../navegador/navegador.service';

describe('SqliteService', () => {
  let service: SqliteService;
  let sqliteSpy: jasmine.SpyObj<SQLite>;
  let navegadorSpy: jasmine.SpyObj<NavegadorService>;
  let fakeDB: jasmine.SpyObj<SQLiteObject>;

  beforeEach(() => {
    fakeDB = jasmine.createSpyObj('SQLiteObject', ['executeSql']);
    fakeDB.executeSql.and.returnValue(
      Promise.resolve({
        rows: {
          length: 0,
          item: (_: number) => null,
        },
        insertId: undefined,
      })
    );

    const sqliteMock = jasmine.createSpyObj('SQLite', ['create']);
    sqliteMock.create.and.returnValue(Promise.resolve(fakeDB));

    const navegadorMock = jasmine.createSpyObj('NavegadorService', [
      'isNavegador',
    ]);

    TestBed.configureTestingModule({
      providers: [
        SqliteService,
        { provide: SQLite, useValue: sqliteMock },
        { provide: NavegadorService, useValue: navegadorMock },
      ],
    });

    service = TestBed.inject(SqliteService);
    sqliteSpy = TestBed.inject(SQLite) as jasmine.SpyObj<SQLite>;
    navegadorSpy = TestBed.inject(
      NavegadorService
    ) as jasmine.SpyObj<NavegadorService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openDB', () => {
    it('should not open DB if is navegador', async () => {
      navegadorSpy.isNavegador.and.returnValue(true);
      await service.openDB();
      expect(sqliteSpy.create).not.toHaveBeenCalled();
    });

    it('should open DB if not navegador', async () => {
      navegadorSpy.isNavegador.and.returnValue(false);
      await service.openDB();
      expect(sqliteSpy.create).toHaveBeenCalledWith({
        name: 'mydb.db',
        location: 'default',
      });
    });
  });

  describe('executeSql', () => {
    it('should simulate result in navegador', async () => {
      navegadorSpy.isNavegador.and.returnValue(true);
      const result = await service.executeSql('SELECT * FROM test');
      expect(result.rows.length).toBe(0);
      expect(result.rows.item(0)).toBeNull();
    });

    it('should execute real query if not navegador', async () => {
      navegadorSpy.isNavegador.and.returnValue(false);
      const result = await service.executeSql('SELECT * FROM test');
      expect(sqliteSpy.create).toHaveBeenCalled();
      expect(fakeDB.executeSql).toHaveBeenCalledWith('SELECT * FROM test', []);
      expect(result.rows.length).toBe(0);
    });

    it('should throw if DB not initialized', async () => {
      navegadorSpy.isNavegador.and.returnValue(false);
      sqliteSpy.create.and.returnValue(Promise.resolve(null as any));
      service['dbInstance'] = null;
      await expectAsync(
        service.executeSql('SELECT * FROM test')
      ).toBeRejectedWithError('DB not initialized');
    });
  });
});
