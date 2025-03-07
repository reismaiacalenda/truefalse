import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// import { runInThisContext } from 'vm';
import { globals } from '../../../globals';

const TF_MONEY_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TfMoneyComponent),
  multi: true
};

@Component({
  selector: 'tf-money',
  templateUrl: './tf-money.component.html',
  //styleUrls: ['./input-field.component.css'],
  providers: [TF_MONEY_VALUE_ACCESSOR],
  standalone: false
})

export class TfMoneyComponent implements ControlValueAccessor {

  @Input() mask: string;
  @Input() suffix: string;
  @Input() prefix: string;
  @Input() classeCss;
  @Input() id: string;
  @Input() label: string;
  @Input() type = 'text';
  @Input() placeholder: string;
  @Input() desabilitar: boolean = false;
  @Input() retirarLabel: boolean = false;
  @Input() alargarCol: boolean = false;
  @Input() tooltip: string;
  @Output() valorModificado = new EventEmitter();

  // @Input() isReadOnly = false;
  // @Input() control;

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

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.desabilitar = isDisabled;
  }

  validarCss(valid){
    if(valid){
      return 'has-success';
    }else{
      return 'has-danger';
    }
  }  


  modelChange(event){
    this.valorModificado.emit(event);
  }

  debugGlobal = globals.debug;
  
}