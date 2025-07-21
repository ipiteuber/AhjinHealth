describe('Registro de usuario', () => {
  const usuario = {
    nombre: 'Pia Test',
    email: 'pia.test@example.com', // Fijo, porque lo limpia antes
    password: 'Test1234!',
  };

  beforeEach(() => {
    cy.visit('/signin');
    cy.clearLocalStorage();

    // Limpia usuario si ya existe (en entorno navegador/localStorage)
    cy.window().then((win) => {
      const usuarios = JSON.parse(win.localStorage.getItem('usuarios') || '[]');
      const filtrados = usuarios.filter((u: any) => u.email !== usuario.email);
      win.localStorage.setItem('usuarios', JSON.stringify(filtrados));
    });
  });

  it('Registra un nuevo usuario correctamente', () => {
    cy.get('input[formcontrolname="nombre"]').type(usuario.nombre);
    cy.get('input[formcontrolname="email"]').type(usuario.email);
    cy.get('input[formcontrolname="password"]').type(usuario.password);
    cy.get('button[type="submit"]').click();

    cy.get('.success-message')
      .should('be.visible')
      .and('contain.text', 'Usuario registrado exitosamente.');

    cy.url({ timeout: 5000 }).should('include', '/login');
  });
});
