import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HistorySchedulePage } from './history-schedule.page';

@NgModule({
  declarations: [HistorySchedulePage],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [HistorySchedulePage],
})
export class HistorySchedulePageModule {}
