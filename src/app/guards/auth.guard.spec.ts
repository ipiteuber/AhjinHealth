import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { UsuarioService } from '../services/usuario/usuario.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  const usuarioServiceStub = {
    getUsuarioLocal: jasmine.createSpy(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy },
        { provide: UsuarioService, useValue: usuarioServiceStub }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation when usuarioActual exists', () => {
    usuarioServiceStub.getUsuarioLocal.and.returnValue({ id: 1, nombre: 'Test' });
    expect(guard.canActivate()).toBeTrue();
  });

  it('should deny activation and redirect when usuarioActual does not exist', () => {
    usuarioServiceStub.getUsuarioLocal.and.returnValue(null);
    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
