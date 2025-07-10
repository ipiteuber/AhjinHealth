// Componente para el formulario de agendamiento de citas
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgendaService, Agenda } from 'src/app/services/agenda/agenda.service';
import { ApiService } from 'src/app/services/api/api.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { UsuarioService, Usuario } from 'src/app/services/usuario/usuario.service';
import { Observable, from } from 'rxjs';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.scss'],
  standalone: false,
})
export class ScheduleFormComponent implements OnInit {
  scheduleForm!: FormGroup;
  citaAgendada = false;
  minDate = new Date().toISOString();
  medicos: any[] = [];
  horasDisponibles: string[] = [];
  ubicacion: string = '';
  isSubmitting = false;

  // Dependencias
  constructor(
    private fb: FormBuilder,
    private agendaService: AgendaService,
    private apiService: ApiService,
    private geolocation: Geolocation,
    private usuarioService: UsuarioService
  ) {}

  // Inicializa form
  ngOnInit(): void {
    this.scheduleForm = this.fb.group({
      medico: [null, Validators.required],
      fecha: [null, Validators.required],
      hora: [null, Validators.required],
      ubicacion: [''],
    });
    this.cargarMedicos();
    this.obtenerUbicacion();
  }

  // Carga los medicos desde la api
  cargarMedicos() {
    this.apiService.getMedicos().subscribe({
      next: (medicos) => {
        this.medicos = medicos;
      },
      error: (err) => {
        console.error('Error al cargar medicos en agendar cita:', err);
        this.medicos = [];
      },
    });
  }

  // Horas disponibles segun medico
  cargarHorasDisponibles() {
    const medicoId = this.scheduleForm.get('medico')?.value;
    const fecha = this.scheduleForm.get('fecha')?.value;

    // Si no hay medico/fecha seleccionada limpia las horas
    if (!medicoId || !fecha) {
      this.horasDisponibles = [];
      return;
    }

    // Recupera usuario actual
    const usuario = this.usuarioService.getUsuarioLocal();
    if (!usuario || !usuario.id) {
      this.horasDisponibles = [];
      return;
    }

    // Obtiene las agendas del servicio
    this.agendaService.getAgendas(usuario.id).subscribe({
      next: (agendas) => {
        const todasLasHoras = [
          '09:00', '10:00', '11:00', '12:00',
          '15:00', '16:00', '17:00', '18:00'
        ];
    
        const ocupadas = agendas
          .filter((a) => a.medico === medicoId && a.fecha === fecha)
          .map((a) => a.hora);
    
        this.horasDisponibles = todasLasHoras.filter(
          (h) => !ocupadas.includes(h)
        );
      },
      error: (error) => {
        console.error('Error al cargar las agendas:', error);
        this.horasDisponibles = [];
      }
    });

  }

  // Se ejecuta cuando cambia el medico o la fecha
  onMedicoFechaChange() {
    if (
      this.scheduleForm.get('medico')?.value &&
      this.scheduleForm.get('fecha')?.value
    ) {
      this.cargarHorasDisponibles();
    } else {
      this.horasDisponibles = [];
    }
    this.scheduleForm.get('hora')?.setValue(null);
  }

  // Obtiene la ubicacion actual del usuario
  obtenerUbicacion() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.ubicacion = `${resp.coords.latitude},${resp.coords.longitude}`;
        this.scheduleForm.get('ubicacion')?.setValue(this.ubicacion);
      })
      .catch(() => {
        this.ubicacion = 'No disponible';
        this.scheduleForm.get('ubicacion')?.setValue('No disponible');
      });
  }
  // Valida si un control del formulario es invalido
  isInvalid(controlName: string): boolean {
    const control = this.scheduleForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Metodo para agendar una cita
  agendarCita(): void {
    // Verifica si form es valido
    if (!this.scheduleForm.valid) {
      this.scheduleForm.markAllAsTouched();
      alert('Completa todos los campos requeridos.');
      return;
    }

    this.isSubmitting = true;
    
    // Recupera usuario del servicio
    const usuario: Usuario | null = this.usuarioService.getUsuarioLocal();

    // Verifica si el usuario esta logueado
    if (!usuario || !usuario.id) {
      alert('Debes iniciar sesion para agendar una cita.');
      this.isSubmitting = false;
      return;
    }

    // Verifica que usuario existe en BD
    this.usuarioService.getUsuarioByEmail(usuario.email).then((usuarioValido) => {
      if (!usuarioValido || usuarioValido.id !== usuario.id) {
        alert('Usuario invalido. Por favor, inicia sesion nuevamente.');
        this.usuarioService.removeUsuarioLocal();
        this.isSubmitting = false;
        return;
      }

      // Crea cita asignando id de usuario y datos de form
      const nuevaCita: Agenda = {
        ...this.scheduleForm.value,
        usuario: usuario.id,
      };

      // Llama al servicio para guardar la cita
      this.agendaService.addAgenda(nuevaCita).subscribe({
        next: () => {
          this.citaAgendada = true;
          this.scheduleForm.reset();
          this.horasDisponibles = [];
          setTimeout(() => (this.citaAgendada = false), 3000);
        },
        error: (err) => {
          console.error('Error al guardar la cita:', err);
          alert('Error al guardar la cita. Intenta nuevamente.');
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    });
  }
}

