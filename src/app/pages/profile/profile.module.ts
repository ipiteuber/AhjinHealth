import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';

import { BaseModule } from 'src/app/components/base/base.module';
import { FormsModule as CustomFormsModule } from 'src/app/components/forms/forms.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BaseModule,         // Navbar y Footer
    CustomFormsModule,   // LoginForm, ScheduleForm, UserData
    ProfilePageRoutingModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
