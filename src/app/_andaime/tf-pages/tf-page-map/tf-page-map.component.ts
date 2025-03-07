import { Component, Input } from '@angular/core';

@Component({
  selector: 'tf-page-map',
  templateUrl: './tf-page-map.component.html',
  standalone: false
})

export class TfPageMapComponent {
  @Input() nomePagina: string;
  @Input() menu: any = [];
  @Input() menuFlag: boolean = true;
  @Input() beta: boolean = false;  
}