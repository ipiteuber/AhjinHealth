import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';

import { BaseModule } from 'src/app/components/base/base.module';
import { FormsModule as CustomFormsModule } from 'src/app/components/forms/forms.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BaseModule,         // Navbar y Footer
    CustomFormsModule,   // LoginForm, RegisterForm ScheduleForm, UserData
    LoginPageRoutingModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
