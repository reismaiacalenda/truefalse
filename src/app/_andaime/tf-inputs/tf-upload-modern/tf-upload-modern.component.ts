import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tf-upload-modern',
  template: `
    <div class="upload-container">
      <input type="file" 
             [accept]="accept" 
             (change)="onFileSelected($event)"
             [multiple]="multiple"
             #fileInput>
      <div class="upload-preview" *ngIf="preview">
        <img [src]="preview" *ngIf="isImage">
      </div>
    </div>
  `,
  styles: [`
    .upload-container { 
      padding: 20px;
      border: 2px dashed #ccc;
    }
    .upload-preview {
      margin-top: 10px;
    }
    .upload-preview img {
      max-width: 200px;
    }
  `],
  standalone: false
})
export class TfUploadModernComponent {
  @Input() accept = 'image/*';
  @Input() multiple = false;
  @Output() uploadComplete = new EventEmitter<File[]>();
  
  preview: string;
  isImage = false;

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.uploadComplete.emit(files);
      
      // Preview para primeira imagem
      if (files[0].type.includes('image')) {
        this.isImage = true;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.preview = e.target.result;
        };
        reader.readAsDataURL(files[0]);
      }
    }
  }
}
