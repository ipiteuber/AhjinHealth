import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
  standalone: false
})
export class UserDataComponent implements OnInit {
  user: { name: string; email: string; password: string } | null = null;
  mostrarPassword = false;

  ngOnInit(): void {
    const storedUser = localStorage.getItem('usuarioActual');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('usuarioActual');
    this.router.navigate(['/login']);
  }
}