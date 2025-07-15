import { TestBed } from '@angular/core/testing';
import { ApiService, Medico, Agenda } from './api.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ---- Medicos ----
  it('should get medicos', () => {
    const mockMedicos: Medico[] = [
      { id: 1, nombre: 'Dr. Juan', especialidad: 'Dermatologia' },
    ];

    service.getMedicos().subscribe((res) => {
      expect(res).toEqual(mockMedicos);
    });

    const req = httpMock.expectOne(`${apiUrl}/medicos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMedicos);
  });

  it('should add medico', () => {
    const medico: Medico = { nombre: 'Dr. Ana', especialidad: 'Pediatria' };

    service.addMedico(medico).subscribe((res) => {
      expect(res).toEqual(medico);
    });

    const req = httpMock.expectOne(`${apiUrl}/medicos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(medico);
    req.flush(medico);
  });

  it('should update medico', () => {
    const medico: Medico = { nombre: 'Dr. Maria', especialidad: 'Neurologia' };

    service.updateMedico(5, medico).subscribe((res) => {
      expect(res).toEqual(medico);
    });

    const req = httpMock.expectOne(`${apiUrl}/medicos/5`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(medico);
    req.flush(medico);
  });

  it('should delete medico', () => {
    service.deleteMedico(3).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/medicos/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // ---- Agendas ----
  it('should get agendas', () => {
    const mockAgendas: Agenda[] = [
      {
        id: 1,
        medico: 2,
        usuario: 3,
        fecha: '2025-07-15',
        hora: '10:00',
      },
    ];

    service.getAgendas().subscribe((res) => {
      expect(res).toEqual(mockAgendas);
    });

    const req = httpMock.expectOne(`${apiUrl}/agenda`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAgendas);
  });

  it('should add agenda', () => {
    const agenda: Agenda = {
      medico: 1,
      usuario: 2,
      fecha: '2025-07-16',
      hora: '11:00',
    };

    service.addAgenda(agenda).subscribe((res) => {
      expect(res).toEqual(agenda);
    });

    const req = httpMock.expectOne(`${apiUrl}/agenda`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(agenda);
    req.flush(agenda);
  });

  it('should update agenda', () => {
    const agenda: Agenda = {
      medico: 1,
      usuario: 2,
      fecha: '2025-07-17',
      hora: '12:00',
    };

    service.updateAgenda(7, agenda).subscribe((res) => {
      expect(res).toEqual(agenda);
    });

    const req = httpMock.expectOne(`${apiUrl}/agenda/7`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(agenda);
    req.flush(agenda);
  });

  it('should delete agenda', () => {
    service.deleteAgenda(9).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/agenda/9`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
