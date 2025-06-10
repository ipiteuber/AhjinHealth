import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

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
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  loginSuccess = false;
  loginError = false;
  isShaking = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.triggerShake();
      return;
    }

    const { email, password } = this.loginForm.value;
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    const matchedUser = storedUsers.find(
      (user: any) => user.email === email && user.password === password
    );

    if (matchedUser) {
      this.loginSuccess = true;
      this.loginError = false;
    } else {
      this.loginError = true;
      this.loginSuccess = false;
      this.triggerShake();
    }
  }

  private triggerShake() {
    this.isShaking = true;
    setTimeout(() => (this.isShaking = false), 500);
  }
}
