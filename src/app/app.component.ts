import { Component } from '@angular/core';
import { DatabaseInitService } from './services/database-init/database-init.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private dbInit: DatabaseInitService) {
    this.initApp();
  }

  async initApp() {
    await this.dbInit.initDatabase();
  }
}
