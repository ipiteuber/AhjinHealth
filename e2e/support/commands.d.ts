/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    prepararUsuario(usuario: any): Chainable<void>;
    registroUI(usuario: any): Chainable<void>;
    loginUI(email: string, contrasena: string): Chainable<void>;
    logoutUI(): Chainable<void>;
  }
}
