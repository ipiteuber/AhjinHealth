import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ScheduleFormComponent } from './schedule-form.component';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { SqliteService } from 'src/app/services/sqlite/sqlite.service';
import { AgendaService } from 'src/app/services/agenda/agenda.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NavegadorService } from 'src/app/services/navegador/navegador.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

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

class GeolocationMock {
  getCurrentPosition() {
    return Promise.resolve({ coords: { latitude: 0, longitude: 0 } });
  }
}

describe('ScheduleFormComponent', () => {
  let component: ScheduleFormComponent;
  let fixture: ComponentFixture<ScheduleFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleFormComponent],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        AgendaService,
        SqliteService,
        { provide: SQLite, useClass: SQLiteMock },
        { provide: NavegadorService, useClass: NavegadorServiceMock },
        { provide: Geolocation, useClass: GeolocationMock },
        provideAnimations(),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
