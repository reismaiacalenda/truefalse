import { Component, Input, forwardRef, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'tf-dropdown',
  templateUrl: './tf-dropdown.component.html'
})

export class TfDropdownComponent {
  @Input() icone;
  @Input() titulo: string = "";
  @Input() iconeOpcao: any[];
  @Input() data: any[];

  // @Input() control;
  // @Input() mask: string = "";
  // @Input() suffix: string = "";
  // @Input() prefix: string = "";
  // @Input() classeCss;
  // @Input() id: string;
  // @Input() label: string = "";
  // @Input() type = 'text';
  // @Input() placeholder: string = "";
  @Input() desabilitar: boolean = false;

  private innerValue: any;

  constructor(private renderer: Renderer2, private el: ElementRef){
    // this.renderer.setProperty(this.el.nativeElement, 'disabled', true)
  }  

}