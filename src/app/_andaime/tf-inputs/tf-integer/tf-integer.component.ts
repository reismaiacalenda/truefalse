import { Component, Input, forwardRef, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { globals } from '../../../globals';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';

const TF_INTEGER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TfIntegerComponent),
  multi: true
};

@Component({
  selector: 'tf-integer',
  templateUrl: './tf-integer.component.html',
  styleUrls: ['./tf-integer.component.css'],
  providers: [TF_INTEGER_VALUE_ACCESSOR],
  standalone: false
})

export class TfIntegerComponent implements ControlValueAccessor{

  @Input() mask: string = "900";
  @Input() classeCss;
  @Input() id: string;
  @Input() label: string = "";
  @Input() retirarLabel: boolean = false;
  @Input() type = 'text';
  @Input() placeholder: string = "000";
  @Input() desabilitar: boolean = false;
  @Input() limiteInferior: Number = 0;
  @Input() limiteSuperior: Number = 999;
  @Input('botoes') botoes: boolean = true;
  @Input() isReadOnly = false;
  @Input() tooltip: string;
  @Output() valorModificado = new EventEmitter();
  flagInicializacao = false;
  // @Input() valorInicialUm = false;

  // inserirLabel(){
  //   if (!this.retirarLabel){
  //     return this.label;
  //   }
  // }

  private innerValue: any;

  get value() {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCb(v);
    }
  }

  onChangeCb: (_: any) => void = () => {};

  onTouchedCb: (_: any) => void = () => {};

  writeValue(v: any): void {
    this.value = v;
  }

  // registerOnChangeIniciarUm(fn: any): void {
  //   this.onChangeCb = fn;
  //   if (this.valorInicial == true){
  //     this.value = 1;
  //   }
  // }

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
    if (this.value == null){
      this.value = 1;
    }
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.desabilitar = isDisabled;
  }

  incrementar(){
    if (this.value < this.limiteSuperior){
      this.value++;
    }
  }

  decrementar(){
    if (this.value > this.limiteInferior){
      this.value--;
    }
  }

  modelChange(event){
    if (this.flagInicializacao == true){
      this.valorModificado.emit(event);
    }else{
      this.flagInicializacao = true;
    }
  }

  debugGlobal = globals.debug;

}