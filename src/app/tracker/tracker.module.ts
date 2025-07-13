import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerComponent } from './tracker.component';



@NgModule({
  declarations: [TrackerComponent],
  imports: [
    CommonModule
  ],
  exports: [TrackerComponent]
})
export class TrackerModule { }
