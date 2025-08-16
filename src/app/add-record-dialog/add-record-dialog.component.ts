import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-record-dialog',
  standalone: true,
  imports: [MatDialogModule,MatFormFieldModule,MatInputModule,FormsModule],
  templateUrl: './add-record-dialog.component.html',
  styleUrl: './add-record-dialog.component.css'
})
export class AddRecordDialogComponent {
  record = { description: '', date: '', amount: 0 };

  constructor(public dialogRef: MatDialogRef<AddRecordDialogComponent>) {}

  save() {
    this.dialogRef.close(this.record);
  }
}
