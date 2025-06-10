import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { LoginFormComponent } from '../login-form/login-form.component';
import { RegisterFormComponent } from '../register-form/register-form.component';
import { ScheduleFormComponent } from '../schedule-form/schedule-form.component';
import { UserDataComponent } from '../user-data/user-data.component';

@NgModule({
  declarations: [LoginFormComponent, RegisterFormComponent, ScheduleFormComponent, UserDataComponent],
    imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    MatFormFieldModule, 
    MatInputModule,     
    MatButtonModule,    
    MatCardModule,      
    MatIconModule       
  ],
  exports: [LoginFormComponent, RegisterFormComponent, ScheduleFormComponent, UserDataComponent]
})
export class FormsModule {}
