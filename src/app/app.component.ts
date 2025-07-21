import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DatabaseInitService } from './services/database-init/database-init.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform, private dbInit: DatabaseInitService) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    if (this.platform.is('android')) {
      // Configuracion para Android
    } else if (this.platform.is('ios')) {
      // Configuracion para iOS
    } else {
      // Configuracion para web u otro
    }

    await this.dbInit.initDatabase();
  }
}
