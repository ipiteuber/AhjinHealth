import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: false,
  animations: [
    trigger('shake', [
      transition('* => true', [
        animate('0.1s', style({ transform: 'translateX(-10px)' })),
        animate('0.1s', style({ transform: 'translateX(10px)' })),
        animate('0.1s', style({ transform: 'translateX(-6px)' })),
        animate('0.1s', style({ transform: 'translateX(6px)' })),
        animate('0.1s', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})

// Componente maneja form de inicio de sesion
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  loginSuccess = false;
  loginError = false;
  isShaking = false;

  // Inyecta dependencias
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  // Metodo inicializa el componente
  async ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    await this.usuarioService.createTable(); // Revisa que la tabla exista
  }

  // Metodo que se ejecuta al enviar form
  async onLogin() {
    // Revisa si el formulario es invalido
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      // Si form es invalido activa shake
      this.triggerShake();
      return;
    }

    // Obtiene email y password del form
    const { email, password } = this.loginForm.value;

    // Busca usuario en la base de datos
    const usuarios = await this.usuarioService.getUsuarios();
    const usuario = usuarios.find(
      (u) => u.email === email && u.contrasena === password
    );

    if (usuario) {
      this.loginSuccess = true;
      this.loginError = false;
      // Guarda sesion para el guard
      localStorage.setItem('usuarioActual', JSON.stringify(usuario));

      // Redirreccion a home en 2s
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 2000);

    } else {
      this.loginError = true;
      this.loginSuccess = false;
      // Si no encuentra usuario activa shake
      this.triggerShake();
    }
  }

  // Metodo activa animacion shake
  private triggerShake() {
    this.isShaking = true;
    setTimeout(() => (this.isShaking = false), 500);
  }
}