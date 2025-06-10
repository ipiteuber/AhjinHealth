import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PickerController } from '@ionic/angular';

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

  horasDisponibles = [
    '09:00', '10:00', '11:00', '12:00',
    '15:00', '16:00', '17:00', '18:00'
  ];

  constructor(private fb: FormBuilder, private pickerCtrl: PickerController) {}

  ngOnInit(): void {
    this.scheduleForm = this.fb.group({
      fecha: [null, Validators.required],
      hora: [null, Validators.required]
    });
  }

  async openHoraPicker() {
    const options = this.horasDisponibles.map(hora => ({
      text: hora,
      value: hora
    }));

    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: 'hora',
          options
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (value) => {
            this.scheduleForm.get('hora')?.setValue(value.hora);
          }
        }
      ]
    });

    await picker.present();
  }

  agendarCita(): void {
    if (this.scheduleForm.valid) {
      const nuevaCita = this.scheduleForm.value;
      const citas = JSON.parse(localStorage.getItem('citas') || '[]');
      citas.push(nuevaCita);
      localStorage.setItem('citas', JSON.stringify(citas));
      this.citaAgendada = true;
      this.scheduleForm.reset();
      setTimeout(() => (this.citaAgendada = false), 3000);
    } else {
      this.scheduleForm.markAllAsTouched();
    }
  }
}
