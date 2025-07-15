import { TestBed } from '@angular/core/testing';
import { DatabaseInitService } from './database-init.service';
import { UsuarioService } from '../usuario/usuario.service';
import { MedicoService } from '../medico/medico.service';
import { AgendaService } from '../agenda/agenda.service';
import { setupSQLiteMock } from 'src/test/setup-tests';

describe('DatabaseInitService', () => {
  let service: DatabaseInitService;

  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let medicoServiceSpy: jasmine.SpyObj<MedicoService>;
  let agendaServiceSpy: jasmine.SpyObj<AgendaService>;

  beforeEach(() => {
    setupSQLiteMock();

    const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['createTable']);
    const medicoSpy = jasmine.createSpyObj('MedicoService', ['createTable']);
    const agendaSpy = jasmine.createSpyObj('AgendaService', ['createTable']);

    TestBed.configureTestingModule({
      providers: [
        DatabaseInitService,
        { provide: UsuarioService, useValue: usuarioSpy },
        { provide: MedicoService, useValue: medicoSpy },
        { provide: AgendaService, useValue: agendaSpy },
      ],
    });

    service = TestBed.inject(DatabaseInitService);
    usuarioServiceSpy = TestBed.inject(
      UsuarioService
    ) as jasmine.SpyObj<UsuarioService>;
    medicoServiceSpy = TestBed.inject(
      MedicoService
    ) as jasmine.SpyObj<MedicoService>;
    agendaServiceSpy = TestBed.inject(
      AgendaService
    ) as jasmine.SpyObj<AgendaService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize database tables', async () => {
    usuarioServiceSpy.createTable.and.returnValue(Promise.resolve());
    medicoServiceSpy.createTable.and.returnValue(Promise.resolve());
    agendaServiceSpy.createTable.and.returnValue(Promise.resolve());

    await service.initDatabase();

    expect(usuarioServiceSpy.createTable).toHaveBeenCalled();
    expect(medicoServiceSpy.createTable).toHaveBeenCalled();
    expect(agendaServiceSpy.createTable).toHaveBeenCalled();
  });
});
