import { Component, OnInit } from '@angular/core';

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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }
}