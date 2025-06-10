import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  standalone: false,
  animations: [
    trigger('shake', [
      transition('* => true', [
        animate('0.5s', style({ transform: 'translateX(-10px)' })),
        animate('0.5s', style({ transform: 'translateX(10px)' })),
        animate('0.5s', style({ transform: 'translateX(-6px)' })),
        animate('0.5s', style({ transform: 'translateX(6px)' })),
        animate('0.5s', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup;
  isShaking = false;
  registrationSuccess = false;
  registrationError = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.isShaking = true;

      // Detener shake despues de la animacion
      setTimeout(() => this.isShaking = false, 500);
      return;
    }

    const userData = this.registerForm.value;

    // Array de users
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // Verifica si existe un usuario con el mismo email
    const emailExists = storedUsers.some((user: any) => user.email === userData.email);

    if (emailExists) {
      console.warn('Ya hay un usuario registrado con ese email.');
      this.registrationError = true;
      this.registrationSuccess = false;
      return;
    }

    // Agrega el nuevo usuario
    storedUsers.push(userData);
    localStorage.setItem('users', JSON.stringify(storedUsers));

    console.log('Registro exitoso:', userData);

    this.registrationSuccess = true;
    this.registrationError = false;
    this.registerForm.reset();
  }
}
