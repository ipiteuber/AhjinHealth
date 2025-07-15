import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { SqliteService } from './services/sqlite/sqlite.service';
import { NavegadorService } from './services/navegador/navegador.service';
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

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule],
      providers: [
        SqliteService,
        { provide: SQLite, useClass: SQLiteMock },
        { provide: NavegadorService, useClass: NavegadorServiceMock },
        provideAnimations(),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
