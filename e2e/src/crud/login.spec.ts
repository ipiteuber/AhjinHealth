describe('Inicio de sesion', () => {
  const usuario = {
    nombre: 'Pia Test',
    email: 'pia.test@example.com',
    contrasena: 'Test1234!',
  };

  beforeEach(() => {
    cy.visit('/login');
    cy.clearLocalStorage();

    // Limpia el usuario si existe para evitar conflictos
    cy.window().then((win) => {
      const usuarios = JSON.parse(win.localStorage.getItem('usuarios') || '[]');
      const filtrados = usuarios.filter((u: any) => u.email !== usuario.email);
      win.localStorage.setItem('usuarios', JSON.stringify(filtrados));
      // Inserta el usuario 
      usuarios.push(usuario);
      win.localStorage.setItem('usuarios', JSON.stringify(usuarios));
    });
  });

  it('Inicia sesion correctamente con usuario existente', () => {
    cy.get('input[formcontrolname="email"]').type(usuario.email);
    cy.get('input[formcontrolname="contrasena"]').type(usuario.contrasena);
    cy.get('button[type="submit"]').click();

    cy.get('.success-message')
      .should('be.visible')
      .and('contain.text', 'Inicio de sesion exitoso');

    cy.url({ timeout: 5000 }).should('include', '/home');
  });

  it('Muestra error con credenciales incorrectas', () => {
    cy.get('input[formcontrolname="email"]').type(usuario.email);
    cy.get('input[formcontrolname="contrasena"]').type('ClaveIncorrecta');
    cy.get('button[type="submit"]').click();

    cy.get('.error-message')
      .should('be.visible')
      .and('contain.text', 'Credenciales incorrectas');

    cy.url().should('include', '/login');
  });

  it('Valida campos requeridos', () => {
    cy.get('button[type="submit"]').click();
    cy.get('mat-error').should('contain.text', 'Campo obligatorio');
  });
});
