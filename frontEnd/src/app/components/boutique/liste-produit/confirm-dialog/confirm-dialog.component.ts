import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;        
  message: string;      
  confirmText?: string; 
  cancelText?: string;  
  type?: 'danger' | 'warning' | 'info'; 
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})

export class ConfirmDialogComponent {
  public dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
    public data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

    onCancel(): void {
      this.dialogRef.close(false); 
    }

    onConfirm(): void {
      this.dialogRef.close(true);
    }
}
