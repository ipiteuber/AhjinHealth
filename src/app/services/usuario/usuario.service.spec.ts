import { TestBed } from '@angular/core/testing';
import { UsuarioService, Usuario } from './usuario.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SqliteService } from '../sqlite/sqlite.service';
import { NavegadorService } from '../navegador/navegador.service';

class SqliteServiceMock {
  private data: Usuario[] = [];

  executeSql(query: string, params: any[] = []): Promise<any> {
    if (query.startsWith('SELECT * FROM usuarios WHERE email = ?')) {
      const usuario = this.data.find((u) => u.email === params[0]);
      return Promise.resolve({
        rows: {
          length: usuario ? 1 : 0,
          item: () => usuario,
        },
      });
    }

    if (query.startsWith('SELECT * FROM usuarios')) {
      return Promise.resolve({
        rows: {
          length: this.data.length,
          item: (i: number) => this.data[i],
        },
      });
    }

    if (query.startsWith('INSERT INTO usuarios')) {
      const id = this.data.length + 1;
      const nuevo = {
        id,
        nombre: params[0],
        email: params[1],
        contrasena: params[2],
        foto: params[3],
      };
      this.data.push(nuevo);
      return Promise.resolve({ insertId: id });
    }

    if (query.startsWith('UPDATE usuarios')) {
      const index = this.data.findIndex((u) => u.id === params[4]);
      if (index !== -1) {
        this.data[index] = {
          id: params[4],
          nombre: params[0],
          email: params[1],
          contrasena: params[2],
          foto: params[3],
        };
      }
      return Promise.resolve({});
    }

    if (query.startsWith('DELETE FROM usuarios')) {
      const id = params[0];
      this.data = this.data.filter((u) => u.id !== id);
      return Promise.resolve({});
    }

    return Promise.resolve({ rows: { length: 0, item: () => null } });
  }
}

class NavegadorServiceMock {
  isNavegador = () => true;
}

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsuarioService,
        { provide: SqliteService, useClass: SqliteServiceMock },
        { provide: NavegadorService, useClass: NavegadorServiceMock },
      ],
    });

    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a user to localStorage', async () => {
    const usuario: Usuario = {
      nombre: 'Test',
      email: 'a@mail.com',
      contrasena: '123',
    };
    const result = await service.addUsuario(usuario);
    expect(result.email).toBe('a@mail.com');
  });

  it('should get user by email from localStorage', async () => {
    const usuario: Usuario = {
      nombre: 'Test',
      email: 'a@mail.com',
      contrasena: '123',
    };
    await service.addUsuario(usuario);
    const fetched = await service.getUsuarioByEmail('a@mail.com');
    expect(fetched?.email).toBe('a@mail.com');
  });

  it('should update a user in localStorage', async () => {
    const usuario: Usuario = {
      nombre: 'Pia',
      email: 'p@mail.com',
      contrasena: 'pass',
    };
    const added = await service.addUsuario(usuario);
    const updated: Usuario = { ...added, nombre: 'PiaActualizada' };
    await service.updateUsuario(updated);
    const stored = JSON.parse(localStorage.getItem('usuarios') || '[]');
    expect(stored[0].nombre).toBe('PiaActualizada');
  });

  it('should delete a user from localStorage', async () => {
    const usuario: Usuario = {
      nombre: 'DeleteMe',
      email: 'del@mail.com',
      contrasena: 'del',
    };
    const added = await service.addUsuario(usuario);
    await service.deleteUsuario(added.id!);
    const remaining = JSON.parse(localStorage.getItem('usuarios') || '[]');
    expect(remaining.length).toBe(0);
  });

  it('should get all users from localStorage', async () => {
    await service.addUsuario({
      nombre: 'User1',
      email: 'u1@mail.com',
      contrasena: '1',
    });
    await service.addUsuario({
      nombre: 'User2',
      email: 'u2@mail.com',
      contrasena: '2',
    });
    const usuarios = await service.getUsuarios();
    expect(usuarios.length).toBe(2);
  });

  it('should store and get usuarioActual in localStorage', () => {
    const usuario: Usuario = {
      id: 1,
      nombre: 'Actual',
      email: 'ac@mail.com',
      contrasena: 'a',
    };
    service.setUsuarioLocal(usuario);
    const result = service.getUsuarioLocal();
    expect(result?.email).toBe('ac@mail.com');
  });

  it('should remove usuarioActual from localStorage', () => {
    localStorage.setItem('usuarioActual', JSON.stringify({ id: 1 }));
    service.removeUsuarioLocal();
    expect(localStorage.getItem('usuarioActual')).toBeNull();
  });

  it('should call syncUsuarioConAPI and return Observable', () => {
    const usuario: Usuario = {
      nombre: 'Pia',
      email: 'sync@mail.com',
      contrasena: '123',
    };
    service.syncUsuarioConAPI(usuario).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/usuarios`);
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });
  });
});
