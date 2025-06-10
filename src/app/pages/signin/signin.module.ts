import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SigninPageRoutingModule } from './signin-routing.module';

import { SigninPage } from './signin.page';

import { BaseModule } from 'src/app/components/base/base.module';
import { FormsModule as CustomFormsModule } from 'src/app/components/forms/forms.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BaseModule,         // Navbar y Footer
    CustomFormsModule,   // LoginForm, ScheduleForm, UserData
    SigninPageRoutingModule
  ],
  declarations: [SigninPage]
})
export class SigninPageModule {}
