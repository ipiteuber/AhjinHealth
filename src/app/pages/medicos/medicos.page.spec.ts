import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicosPage } from './medicos.page';
import { MedicoService } from '../../services/medico/medico.service';
import { setupSQLiteMock } from 'src/test/setup-tests';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MedicosPage', () => {
  let component: MedicosPage;
  let fixture: ComponentFixture<MedicosPage>;
  let medicoServiceSpy: jasmine.SpyObj<MedicoService>;

  beforeEach(async () => {
    setupSQLiteMock();

    const spy = jasmine.createSpyObj('MedicoService', ['getMedicos']);

    await TestBed.configureTestingModule({
      declarations: [MedicosPage, NavbarComponent, FooterComponent],
      providers: [{ provide: MedicoService, useValue: spy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    medicoServiceSpy = TestBed.inject(
      MedicoService
    ) as jasmine.SpyObj<MedicoService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load medicos on init', async () => {
    const mockMedicos = [{ id: 1, nombre: 'Dr. Test' } as any];
    medicoServiceSpy.getMedicos.and.returnValue(Promise.resolve(mockMedicos));

    await component.ngOnInit();

    expect(component.medicos).toEqual(mockMedicos);
    expect(medicoServiceSpy.getMedicos).toHaveBeenCalled();
  });
});
