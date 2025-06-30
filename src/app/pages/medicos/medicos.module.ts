import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicosPageRoutingModule } from './medicos-routing.module';

import { MedicosPage } from './medicos.page';

import { BaseModule } from 'src/app/components/base/base.module';
import { FormsModule as CustomFormsModule } from 'src/app/components/forms/forms.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicosPageRoutingModule,
    BaseModule, // Navbar y Footer
    CustomFormsModule // LoginForm, RegisterForm ScheduleForm, UserData
  ],
  declarations: [MedicosPage],
})
export class MedicosPageModule {}
