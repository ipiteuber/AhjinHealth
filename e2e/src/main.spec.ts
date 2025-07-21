describe('Flujo principal E2E', () => {
  const usuario = {
    nombre: 'Pia Test',
    email: 'pia.test@example.com',
    contrasena: 'Test1234!',
  };

  before(() => {
    cy.clearLocalStorage();
  });

  it('Registra un nuevo usuario correctamente', () => {
    cy.visit('/signin');
    cy.get('input[formcontrolname="nombre"]').type(usuario.nombre);
    cy.get('input[formcontrolname="email"]').type(usuario.email);
    cy.get('input[formcontrolname="password"]').type(usuario.contrasena);
    cy.get('button[type="submit"]').click();

    cy.get('.success-message')
      .should('be.visible')
      .and('contain.text', 'Usuario registrado exitosamente.');

    cy.url().should('include', '/login');
  });

  it('Inicia sesion correctamente', () => {
    cy.visit('/login');
    cy.get('input[formcontrolname="email"]').type(usuario.email);
    cy.get('input[formcontrolname="contrasena"]').type(usuario.contrasena);
    cy.get('button[type="submit"]').click();

    cy.get('.success-message')
      .should('be.visible')
      .and('contain.text', 'Inicio de sesion exitoso');

    cy.url().should('include', '/home');
  });


  it('Actualiza el perfil del usuario', () => {
    cy.visit('/profile');
    cy.get('input[formcontrolname="nombre"]').clear().type('Pia Actualizada');
    cy.get('button.save-profile').click();
    cy.get('.success-message')
      .should('be.visible')
      .and('contain.text', 'Perfil actualizado');
  });

  it('Simula agregar foto de perfil al usuario', () => {
    const base64Mock = 'data:image/jpeg;base64,' + 'FAKE_BASE64_IMAGE_DATA==';

    cy.window().then((win) => {
      const usuarios = JSON.parse(win.localStorage.getItem('usuarios') || '[]');
      const index = usuarios.findIndex((u: any) => u.email === usuario.email);
      if (index !== -1) {
        usuarios[index].foto = base64Mock;
        win.localStorage.setItem('usuarios', JSON.stringify(usuarios));
        win.localStorage.setItem('usuario', JSON.stringify(usuarios[index]));
      }
    });

    cy.visit('/profile');
    cy.get('img')
      .should('be.visible')
      .and(($img) => {
        const src = $img.attr('src') || '';
        expect(src).to.include('data:image/jpeg;base64,');
      });
  });

  it('Agenda una nueva cita medica', () => {
    cy.visit('/schedule');
    cy.get('select[name="medico"]').select('Dr. Juan Perez');
    cy.get('input[name="fecha"]').type('2025-07-25');
    cy.get('select[name="hora"]').select('10:00');
    cy.get('button.submit-schedule').click();

    cy.get('.success-message')
      .should('be.visible')
      .and('contain.text', 'Cita agendada exitosamente');
  });

  it('Cierra sesion desde perfil', () => {
    cy.visit('/profile');
    cy.on('window:alert', () => true);
    cy.get('button.logout').should('exist').click();
    cy.url().should('include', '/login');
  });
});
