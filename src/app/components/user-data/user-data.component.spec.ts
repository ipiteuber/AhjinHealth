import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDataComponent } from './user-data.component';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { NavegadorService } from 'src/app/services/navegador/navegador.service';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { setupSQLiteMock } from 'src/test/setup-tests';

describe('UserDataComponent', () => {
  let component: UserDataComponent;
  let fixture: ComponentFixture<UserDataComponent>;

  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let navegadorServiceSpy: jasmine.SpyObj<NavegadorService>;
  let cameraSpy: jasmine.SpyObj<Camera>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    setupSQLiteMock();

    const usuarioSpy = jasmine.createSpyObj('UsuarioService', [
      'getUsuarioLocal',
      'removeUsuarioLocal',
      'setUsuarioLocal',
      'updateUsuario',
    ]);
    const navegadorSpy = jasmine.createSpyObj('NavegadorService', [
      'isNavegador',
    ]);
    const cameraMock = jasmine.createSpyObj('Camera', ['getPicture']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [UserDataComponent],
      providers: [
        { provide: UsuarioService, useValue: usuarioSpy },
        { provide: NavegadorService, useValue: navegadorSpy },
        { provide: Camera, useValue: cameraMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    usuarioServiceSpy = TestBed.inject(
      UsuarioService
    ) as jasmine.SpyObj<UsuarioService>;
    navegadorServiceSpy = TestBed.inject(
      NavegadorService
    ) as jasmine.SpyObj<NavegadorService>;
    cameraSpy = TestBed.inject(Camera) as jasmine.SpyObj<Camera>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDataComponent);
    component = fixture.componentInstance;
  });

  it('should create and load user', () => {
    const mockUser = {
      nombre: 'Test',
      email: 'test@test.com',
      contrasena: '1234',
    };
    usuarioServiceSpy.getUsuarioLocal.and.returnValue(mockUser);

    component.ngOnInit();

    expect(component).toBeTruthy();
    expect(component.user).toEqual(mockUser);
  });

  it('should toggle mostrarPassword', () => {
    component.mostrarPassword = false;
    component.togglePassword();
    expect(component.mostrarPassword).toBeTrue();
    component.togglePassword();
    expect(component.mostrarPassword).toBeFalse();
  });

  it('should logout user and navigate to login', () => {
    component.user = { nombre: 'Test' } as any;
    component.logout();

    expect(usuarioServiceSpy.removeUsuarioLocal).toHaveBeenCalled();
    expect(component.user).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should prevent camera usage in navegador', async () => {
    navegadorServiceSpy.isNavegador.and.returnValue(true);
    spyOn(window, 'alert');

    await component.tomarFoto();
    expect(window.alert).toHaveBeenCalledWith(
      'La camara no esta disponible en navegador'
    );

    await component.elegirFoto();
    expect(window.alert).toHaveBeenCalledWith(
      'La camara no esta disponible en navegador'
    );
  });
});
