import { Component, OnInit } from '@angular/core';
import { MedicoService, Medico } from '../../services/medico/medico.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.page.html',
  styleUrls: ['./medicos.page.scss'],
  standalone: false,
})

export class MedicosPage implements OnInit {
  medicos: Medico[] = [];

  // Inyecta el servicio MedicoService
  constructor(private medicoService: MedicoService) {}

  // Metodo que se ejecuta al iniciar el componente
  async ngOnInit() {
    // Obtiene medicos desde BD
    this.medicos = await this.medicoService.getMedicos();
  }
}
