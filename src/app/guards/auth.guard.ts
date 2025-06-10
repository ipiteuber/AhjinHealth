import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const usuario = localStorage.getItem('usuarioActual');
    if (usuario) {
      return true; // Sesion activa
    } else {
      this.router.navigate(['/login']);
      return false; // Redirige si no hay sesion
    }
  }
}
