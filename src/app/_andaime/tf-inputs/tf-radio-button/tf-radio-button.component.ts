import { Component, Input, forwardRef, AfterViewInit, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { globals } from '../../../globals';

const TF_RADIO_BUTTON_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TfRadioButtonComponent),
  multi: true
};

@Component({
  selector: 'tf-radio-button',
  templateUrl: './tf-radio-button.component.html',
  //styleUrls: ['./input-field.component.css'],
  providers: [TF_RADIO_BUTTON_VALUE_ACCESSOR],
  standalone: false
})

export class TfRadioButtonComponent implements ControlValueAccessor {

  @Input() classeCss;
  @Input() id: string;
  @Input() label: string;
  @Input() data: any[];
  @Input() type = 'text';
  @Input() placeholder: string;
  @Input() desabilitar: boolean = false;
  @Input() retirarLabel: boolean = false;
  @Input() tooltip: string;
  // @Input() control;
  // @Input() isReadOnly = false;

  private innerValue: any;

  colorirRadio(stateColor){
    if (stateColor){
      return `m-radio--state-${stateColor}`;
    }else{
      return "m-radio--state-brand";
    }
  }
  
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
    if (this.value == null){
      this.value = this.data[0].value;
    }
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.desabilitar = isDisabled;
  }
  
  debugGlobal = globals.debug;
  
}