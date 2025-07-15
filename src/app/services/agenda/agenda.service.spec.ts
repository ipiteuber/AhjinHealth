import { TestBed } from '@angular/core/testing';
import { AgendaService, Agenda } from './agenda.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SqliteService } from '../sqlite/sqlite.service';
import { NavegadorService } from '../navegador/navegador.service';
import { setupSQLiteMock } from 'src/test/setup-tests';

class NavegadorServiceMock {
  isNavegador(): boolean {
    return true;
  }
}

describe('AgendaService', () => {
  let service: AgendaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AgendaService,
        SqliteService,
        { provide: NavegadorService, useClass: NavegadorServiceMock },
      ],
    });

    setupSQLiteMock();

    service = TestBed.inject(AgendaService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw error if offline when adding agenda', () => {
    spyOnProperty(navigator, 'onLine').and.returnValue(false);
    const agenda: Agenda = {
      medico: 1,
      usuario: 2,
      fecha: '2025-01-01',
      hora: '10:00',
    };
    expect(() => service.addAgenda(agenda)).toThrowError(
      'Sin conexion a internet, no se puede agendar.'
    );
  });

  it('should call API to add agenda when online', () => {
    spyOnProperty(navigator, 'onLine').and.returnValue(true);
    const agenda: Agenda = {
      medico: 1,
      usuario: 2,
      fecha: '2025-01-01',
      hora: '10:00',
    };
    service.addAgenda(agenda).subscribe((res) => {
      expect(res).toEqual(agenda);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/agenda`);
    expect(req.request.method).toBe('POST');
    req.flush(agenda);
  });

  it('should update localStorage agenda in navegador', async () => {
    const agenda: Agenda = {
      id: 1,
      medico: 1,
      usuario: 2,
      fecha: '2025-01-01',
      hora: '10:00',
    };
    localStorage.setItem('agendas', JSON.stringify([agenda]));

    await service.updateAgenda(1, { ...agenda, hora: '11:00' });
    const agendas = JSON.parse(localStorage.getItem('agendas') || '[]');
    expect(agendas[0].hora).toBe('11:00');
  });

  it('should delete agenda from localStorage in navegador', async () => {
    const agenda: Agenda = {
      id: 1,
      medico: 1,
      usuario: 2,
      fecha: '2025-01-01',
      hora: '10:00',
    };
    localStorage.setItem('agendas', JSON.stringify([agenda]));
    await service.deleteAgenda(1);
    const agendas = JSON.parse(localStorage.getItem('agendas') || '[]');
    expect(agendas.length).toBe(0);
  });

  it('should get agendas from localStorage in navegador', (done) => {
    const agendas: Agenda[] = [
      { id: 1, medico: 1, usuario: 10, fecha: '2025-01-01', hora: '10:00' },
      { id: 2, medico: 2, usuario: 10, fecha: '2025-01-02', hora: '11:00' },
    ];
    localStorage.setItem('agendas', JSON.stringify(agendas));
    service.getAgendas(10).subscribe((res) => {
      expect(res.length).toBe(2);
      done();
    });
  });

  it('isNavegador() should return true using mock', () => {
    expect(service.isNavegador()).toBeTrue();
  });
});
