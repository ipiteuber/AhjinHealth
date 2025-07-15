import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RegisterFormComponent } from './register-form.component';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { SqliteService } from '../../services/sqlite/sqlite.service';
import { NavegadorService } from '../../services/navegador/navegador.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterFormComponent],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        SqliteService,
        { provide: SQLite, useClass: SQLiteMock },
        { provide: NavegadorService, useClass: NavegadorServiceMock },
        provideAnimations(),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
