import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  standalone: false,
  animations: [
    trigger('shake', [
      transition('* => true', [
        animate('0.1s', style({ transform: 'translateX(-10px)' })),
        animate('0.1s', style({ transform: 'translateX(10px)' })),
        animate('0.1s', style({ transform: 'translateX(-6px)' })),
        animate('0.1s', style({ transform: 'translateX(6px)' })),
        animate('0.1s', style({ transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})

// Componente maneja form de registro
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup;
  isShaking = false;
  registrationSuccess = false;
  registrationError = false;

  // Inyecta dependencias
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  // Metodo inicializa el componente
  async ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Validacion de contrasena
      // Al menos 8 caracteres, una mayuscula, un numero y un caracter especial
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$/)
      ]],
    });
    await this.usuarioService.createTable(); // Revisa que la tabla exista
  }

  // Metodo activa animacion shake
  private triggerShake(): void {
    this.isShaking = true;
    setTimeout(() => (this.isShaking = false), 500);
  }

  // Metodo que se ejecuta al enviar form
  async onSubmit() {
    // Revisa si el formulario es invalido
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      // Si form es invalido activa shake
      this.triggerShake();
      return;
    }

    // Crea objeto usuario con los datos del form
    const userData: Usuario = {
      nombre: this.registerForm.value.name,
      email: this.registerForm.value.email,
      contrasena: this.registerForm.value.password,
    };

    // Verifica si existe un usuario con el mismo email en SQLite
    const usuarios = await this.usuarioService.getUsuarios();
    const emailExists = usuarios.some((u) => u.email === userData.email);

    if (emailExists) {
      console.warn('Ya hay un usuario registrado con ese email.');
      this.registrationError = true;
      this.registrationSuccess = false;

      // Animacion boton al fallar el registro
      this.triggerShake();

      return;
    }

    // Agrega el nuevo usuario a SQLite
    await this.usuarioService.addUsuario(userData);

    this.registrationSuccess = true;
    this.registrationError = false;

    console.log('Registro exitoso:', userData);

    // Redirreccion al login
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);

    this.registrationError = false;
    this.registerForm.reset();
  }
}
