import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { UsuarioService, Usuario } from '../../services/usuario/usuario.service';

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

    const { email, password } = this.loginForm.value; // Obtiene email y password del form
    const usuario: Usuario | null = await this.usuarioService.getUsuarioByEmail(email); // Busca usuario por email en BD

    // Verifica contrasena de usuario
    if (usuario != null && usuario.contrasena === password) {
      this.loginSuccess = true;
      this.loginError = false;

      this.usuarioService.setUsuarioLocal(usuario); // Guarda sesion para el guard

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