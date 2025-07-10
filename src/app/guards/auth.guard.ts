import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  canActivate(): boolean {
    const usuario = this.usuarioService.getUsuarioLocal();
    if (usuario) {
      return true; // Sesion activa
    } else {
      this.router.navigate(['/login']);
      return false; // Redirige si no hay sesion
    }
  }
}
