import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import {
  UsuarioService,
  Usuario,
} from '../../services/usuario/usuario.service';

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
      nombre: [
        '',
        [
          // Validacion de nombre
          Validators.required,
          Validators.pattern(/^[a-zA-Z\s]{2,}$/),
        ],
      ],
      email: [
        '',
        // Validacion de email
        [Validators.required, Validators.email, Validators.maxLength(80)],
      ],
      password: [
        '',
        [
          // Validacion de contrasena
          // Al menos 8 caracteres, una mayuscula, un numero y un caracter especial
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
        ],
      ],
    });
  }

  // Metodo activa animacion shake
  private triggerShake(): void {
    this.isShaking = true;
    setTimeout(() => (this.isShaking = false), 500);
  }

  // Metodo se ejecuta al enviar form
  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.triggerShake();
      return;
    }

    // Crea objeto usuario con los datos del form
    const userData: Usuario = {
      nombre: this.registerForm.value.name,
      email: this.registerForm.value.email,
      contrasena: this.registerForm.value.password,
    };

    const usuarios = await this.usuarioService.getUsuarios();
    const emailExists = usuarios.some((u) => u.email === userData.email);

    if (emailExists) {
      console.warn('Ya hay un usuario registrado con ese email.');
      this.registrationError = true;
      this.registrationSuccess = false;
      this.triggerShake();
      return;
    }

    // Agrega el nuevo usuario a SQLite
    try {
      const nuevoUsuario = await this.usuarioService.addUsuario(userData);

      this.registrationSuccess = true;
      this.registrationError = false;

      console.log('Registro exitoso:', nuevoUsuario);

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);

      this.registerForm.reset();
    } catch (error) {
      console.error('Error durante el registro:', error);
      this.registrationError = true;
      this.registrationSuccess = false;
      this.triggerShake();
    }
  }
}
