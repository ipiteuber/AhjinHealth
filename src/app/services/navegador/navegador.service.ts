import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavegadorService {
  constructor() {}

  // Metodo comprueba si se esta ejecutando en un navegador o en una app nativa
  isNavegador(): boolean {
    return (
      typeof window !== 'undefined' &&
      !window.hasOwnProperty('cordova') &&
      !(window as any).Capacitor?.isNativePlatform
    );
  }
}
