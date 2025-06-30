import { Component, OnInit } from '@angular/core';
import { MedicoService, Medico } from '../../services/medico/medico.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.page.html',
  styleUrls: ['./medicos.page.scss'],
  standalone: false,
})

// Componente que maneja la pagina de medicos para mostrar la lista de medicos
export class MedicosPage implements OnInit {
  medicos: Medico[] = [];

  // Inyecta el servicio MedicoService
  constructor(private medicoService: MedicoService) {}

  // Metodo que se ejecuta al iniciar el componente
  async ngOnInit() {
    // Crea la tabla de medicos si no existe
    await this.medicoService.createTable();
    // Obtiene la lista de medicos
    this.medicos = await this.medicoService.getMedicos();

    // Medicos de prueba 
    if (this.medicos.length === 0) {
      await this.medicoService.addMedico({ nombre: 'Dra. Ana', especialidad: 'Cardiologia' });
      await this.medicoService.addMedico({ nombre: 'Dr. Juan', especialidad: 'Pediatria' });
      await this.medicoService.addMedico({ nombre: 'Dra. Laura', especialidad: 'Dermatologia' });
      this.medicos = await this.medicoService.getMedicos();
    }
  }
}
