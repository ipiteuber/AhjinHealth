import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false
})
export class NavbarComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  navigate(route: string): void {
  this.router.navigate([route]);
  }
}
