import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { IonicModule } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { SqliteService } from 'src/app/services/sqlite/sqlite.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NavegadorService } from 'src/app/services/navegador/navegador.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

class SQLiteMock {
  create(config: any): Promise<any> {
    return Promise.resolve({
      executeSql: () =>
        Promise.resolve({ rows: { length: 0, item: () => null } }),
      transaction: (fn: any) => Promise.resolve(fn({ executeSql: () => {} })),
      close: () => Promise.resolve(),
    });
  }
}

class NavegadorServiceMock {
  isNavegador() {
    return true;
  }
}

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        UsuarioService,
        SqliteService,
        { provide: SQLite, useClass: SQLiteMock },
        { provide: NavegadorService, useClass: NavegadorServiceMock },
        provideAnimations(),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
