// Agrega un usuario en localStorage
Cypress.Commands.add('prepararUsuario', (usuario) => {
  cy.window().then((win) => {
    let usuarios = JSON.parse(win.localStorage.getItem('usuarios') || '[]');
    usuarios = usuarios.filter((u) => u.email !== usuario.email);
    usuarios.push(usuario);
    win.localStorage.setItem('usuarios', JSON.stringify(usuarios));
  });
});

// Registro UI
Cypress.Commands.add('registroUI', (usuario) => {
  cy.visit('/signin');
  cy.get('input[formcontrolname="nombre"]').type(usuario.nombre);
  cy.get('input[formcontrolname="email"]').type(usuario.email);
  cy.get('input[formcontrolname="password"]').type(usuario.contrasena);
  cy.get('button[type="submit"]').click();
});

// Login UI
Cypress.Commands.add('loginUI', (email, contrasena) => {
  cy.visit('/login');
  cy.get('input[formcontrolname="email"]').type(email);
  cy.get('input[formcontrolname="contrasena"]').type(contrasena);
  cy.get('button[type="submit"]').click();
});

// Logout UI
Cypress.Commands.add('logoutUI', () => {
  cy.visit('/profile');
  cy.on('window:alert', () => true);
  cy.get('button.logout').click();
});
