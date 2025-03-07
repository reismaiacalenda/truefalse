import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { globals } from '../../../globals';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

const TF_FLOAT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TfFloatComponent),
  multi: true
};
@Component({
  selector: 'tf-float',
  templateUrl: './tf-float.component.html',
  //styleUrls: ['./input-field.component.css'],
  providers: [TF_FLOAT_VALUE_ACCESSOR, provideNgxMask()],
  standalone: false
})

export class TfFloatComponent implements ControlValueAccessor {

  @Input() mask: string;
  @Input() suffix: string;
  @Input() prefix: string;
  @Input() classeCss;
  @Input() id: string;
  @Input() label: string;
  @Input() type = 'text';
  @Input() placeholder: string;
  @Input() desabilitar: boolean = false;
  @Input() isReadOnly: boolean = false;
  @Input() tooltip: string;

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

  debugGlobal = globals.debug;
  
}