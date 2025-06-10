import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { LoginFormComponent } from '../login-form/login-form.component';
import { ScheduleFormComponent } from '../schedule-form/schedule-form.component';
import { UserDataComponent } from '../user-data/user-data.component';

@NgModule({
  declarations: [LoginFormComponent, ScheduleFormComponent, UserDataComponent],
  imports: [CommonModule, IonicModule],
  exports: [LoginFormComponent, ScheduleFormComponent, UserDataComponent]
})
export class FormsModule {}
