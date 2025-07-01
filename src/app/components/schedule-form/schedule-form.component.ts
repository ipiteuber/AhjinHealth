// Componente para el formulario de agendamiento de citas
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgendaService, Agenda } from 'src/app/services/agenda/agenda.service';
import { ApiService } from 'src/app/services/api/api.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.scss'],
  standalone: false
})
export class ScheduleFormComponent implements OnInit {
  scheduleForm!: FormGroup;
  citaAgendada = false;
  minDate = new Date().toISOString();
  medicos: any[] = [];
  horasDisponibles: string[] = [];
  ubicacion: string = '';
  agenda: any[] = [];

  // Dependencias
  constructor(
    private fb: FormBuilder,
    private agendaService: AgendaService,
    private apiService: ApiService,
    private geolocation: Geolocation
  ) {}

  // Inicializa form
  ngOnInit(): void {
    this.scheduleForm = this.fb.group({
      medico: [null, Validators.required],
      fecha: [null, Validators.required],
      hora: [null, Validators.required],
      ubicacion: ['']
    });
    this.cargarMedicos();
    this.obtenerUbicacion();
  }

  // Carga los medicos desde la api
  cargarMedicos() {
    this.apiService.getMedicos().subscribe(medicos => {
      this.medicos = medicos;
    });
  }

  // Horas disponibles segun medico
  cargarHorasDisponibles() {
    const medicoId = this.scheduleForm.get('medico')?.value;
    const fecha = this.scheduleForm.get('fecha')?.value;
    if (!medicoId || !fecha) {
      this.horasDisponibles = [];
      return;
    }
    this.agendaService.getAgendas().subscribe(agendas => {
      this.agenda = agendas;
      // Horas para agendar
      const todasLasHoras = [
        '09:00', '10:00', '11:00', '12:00',
        '15:00', '16:00', '17:00', '18:00'
      ];
      // Filtra las horas 
      const ocupadas = agendas
        .filter(a => a.medico === medicoId && a.fecha === fecha)
        .map(a => a.hora);
      this.horasDisponibles = todasLasHoras.filter(h => !ocupadas.includes(h));
    });
  }

  // Se ejecuta cuando cambia el medico o la fecha
  onMedicoFechaChange() {
    if (this.scheduleForm.get('medico')?.value && this.scheduleForm.get('fecha')?.value) {
      this.cargarHorasDisponibles();
    } else {
      this.horasDisponibles = [];
    }
    this.scheduleForm.get('hora')?.setValue(null);
  }

  // Obtiene la ubicacion actual del usuario
  obtenerUbicacion() {
    this.geolocation.getCurrentPosition().then(resp => {
      this.ubicacion = `${resp.coords.latitude},${resp.coords.longitude}`;
      this.scheduleForm.get('ubicacion')?.setValue(this.ubicacion);
    }).catch(() => {
      this.ubicacion = 'No disponible';
      this.scheduleForm.get('ubicacion')?.setValue('No disponible');
    });
  }

  // Metodo para agendar una cita
  agendarCita(): void {
    if (this.scheduleForm.valid) {
      // Obtiene el usuario logueado desde localStorage
      const usuarioStr = localStorage.getItem('usuarioActual');
      const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

      // Verifica si el usuario esta logueado
      if (!usuario || !usuario.id) {
        alert('Debes iniciar sesion para agendar una cita.');
        return;
      }

      // Objeto cita con datos de form
      const nuevaCita: Agenda = {
        ...this.scheduleForm.value,
        usuario: usuario.id
      };

      // Llama al servicio para guardar la cita
      this.agendaService.addAgenda(nuevaCita).subscribe({
        next: () => {
          this.citaAgendada = true;
          this.scheduleForm.reset();
          setTimeout(() => (this.citaAgendada = false), 3000);
        }
      });
    } else {
      this.scheduleForm.markAllAsTouched();
      alert('Completa todos los campos requeridos.');
    }
  }
}

