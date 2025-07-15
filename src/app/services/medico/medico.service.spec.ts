import { TestBed } from '@angular/core/testing';
import { MedicoService } from './medico.service';
import { SqliteService } from '../sqlite/sqlite.service';
import { NavegadorService } from '../navegador/navegador.service';
import { setupSQLiteMock } from 'src/test/setup-tests';

describe('MedicoService', () => {
  let service: MedicoService;
  let sqliteServiceSpy: jasmine.SpyObj<SqliteService>;
  let navegadorServiceSpy: jasmine.SpyObj<NavegadorService>;

  beforeEach(() => {
    const sqliteSpy = jasmine.createSpyObj('SqliteService', ['executeSql']);
    const navegadorSpy = jasmine.createSpyObj('NavegadorService', [
      'isNavegador',
    ]);

    TestBed.configureTestingModule({
      providers: [
        MedicoService,
        { provide: SqliteService, useValue: sqliteSpy },
        { provide: NavegadorService, useValue: navegadorSpy },
      ],
    });

    setupSQLiteMock();

    service = TestBed.inject(MedicoService);
    sqliteServiceSpy = TestBed.inject(
      SqliteService
    ) as jasmine.SpyObj<SqliteService>;
    navegadorServiceSpy = TestBed.inject(
      NavegadorService
    ) as jasmine.SpyObj<NavegadorService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createTable', () => {
    it('should not create table in navegador', async () => {
      navegadorServiceSpy.isNavegador.and.returnValue(true);
      await service.createTable();
      expect(sqliteServiceSpy.executeSql).not.toHaveBeenCalled();
    });

    it('should create table in sqlite', async () => {
      navegadorServiceSpy.isNavegador.and.returnValue(false);
      sqliteServiceSpy.executeSql.and.returnValue(Promise.resolve());
      await service.createTable();
      expect(sqliteServiceSpy.executeSql).toHaveBeenCalledWith(
        jasmine.stringMatching(/CREATE TABLE IF NOT EXISTS medicos/)
      );
    });
  });

  describe('addMedico', () => {
    it('should throw if nombre or especialidad missing', async () => {
      await expectAsync(
        service.addMedico({ nombre: '', especialidad: '' })
      ).toBeRejected();
    });

    it('should add medico in navegador', async () => {
      navegadorServiceSpy.isNavegador.and.returnValue(true);
      spyOn(service, 'getMedicos').and.returnValue(Promise.resolve([]));
      spyOn(localStorage, 'setItem');
      await service.addMedico({ nombre: 'Test', especialidad: 'Especialidad' });
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should add medico in sqlite', async () => {
      navegadorServiceSpy.isNavegador.and.returnValue(false);
      sqliteServiceSpy.executeSql.and.returnValue(Promise.resolve());
      await service.addMedico({ nombre: 'Test', especialidad: 'Especialidad' });
      expect(sqliteServiceSpy.executeSql).toHaveBeenCalledWith(
        'INSERT INTO medicos (nombre, especialidad) VALUES (?, ?)',
        ['Test', 'Especialidad']
      );
    });
  });

  describe('getMedicos', () => {
    it('should return medicos from localStorage in navegador', async () => {
      navegadorServiceSpy.isNavegador.and.returnValue(true);
      spyOn(localStorage, 'getItem').and.returnValue(
        JSON.stringify([{ id: 1, nombre: 'A', especialidad: 'B' }])
      );
      const medicos = await service.getMedicos();
      expect(medicos.length).toBe(1);
    });

    it('should return medicos from sqlite', async () => {
      navegadorServiceSpy.isNavegador.and.returnValue(false);
      const fakeResult = {
        rows: {
          length: 1,
          item: (i: number) => ({ id: 1, nombre: 'A', especialidad: 'B' }),
        },
      };
      sqliteServiceSpy.executeSql.and.returnValue(Promise.resolve(fakeResult));
      const medicos = await service.getMedicos();
      expect(medicos.length).toBe(1);
      expect(medicos[0].nombre).toBe('A');
    });
  });

  describe('updateMedico', () => {
    it('should throw if no id', async () => {
      await expectAsync(
        service.updateMedico({ nombre: 'A', especialidad: 'B' })
      ).toBeRejected();
    });

    it('should throw if nombre or especialidad missing', async () => {
      await expectAsync(
        service.updateMedico({ id: 1, nombre: '', especialidad: '' })
      ).toBeRejected();
    });

    it('should update medico in navegador', async () => {
      navegadorServiceSpy.isNavegador.and.returnValue(true);
      const medicos = [{ id: 1, nombre: 'Old', especialidad: 'Old' }];
      spyOn(service, 'getMedicos').and.returnValue(Promise.resolve(medicos));
      spyOn(localStorage, 'setItem');
      await service.updateMedico({ id: 1, nombre: 'New', especialidad: 'New' });
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should update medico in sqlite', async () => {
      navegadorServiceSpy.isNavegador.and.returnValue(false);
      sqliteServiceSpy.executeSql.and.returnValue(Promise.resolve());
      await service.updateMedico({ id: 1, nombre: 'New', especialidad: 'New' });
      expect(sqliteServiceSpy.executeSql).toHaveBeenCalledWith(
        'UPDATE medicos SET nombre = ?, especialidad = ? WHERE id = ?',
        ['New', 'New', 1]
      );
    });
  });

  describe('deleteMedico', () => {
    it('should throw if no id', async () => {
      await expectAsync(service.deleteMedico(undefined as any)).toBeRejected();
    });

    it('should delete medico in navegador', async () => {
      navegadorServiceSpy.isNavegador.and.returnValue(true);
      const medicos = [{ id: 1, nombre: 'A', especialidad: 'B' }];
      spyOn(service, 'getMedicos').and.returnValue(Promise.resolve(medicos));
      spyOn(localStorage, 'setItem');
      await service.deleteMedico(1);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should delete medico in sqlite', async () => {
      navegadorServiceSpy.isNavegador.and.returnValue(false);
      sqliteServiceSpy.executeSql.and.returnValue(Promise.resolve());
      await service.deleteMedico(1);
      expect(sqliteServiceSpy.executeSql).toHaveBeenCalledWith(
        'DELETE FROM medicos WHERE id = ?',
        [1]
      );
    });
  });
});
