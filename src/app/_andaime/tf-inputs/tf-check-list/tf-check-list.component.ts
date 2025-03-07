import { Component, Input, forwardRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { globals } from '../../../globals';
import { CommonModule } from '@angular/common';

const TF_CHECK_LIST_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TfCheckListComponent),
  multi: true
};

@Component({
  selector: 'tf-check-list',
  templateUrl: './tf-check-list.component.html',
  providers: [TF_CHECK_LIST_VALUE_ACCESSOR],
  standalone: false
})

export class TfCheckListComponent implements ControlValueAccessor {

  @Input() classeCss = "m-checkbox--state-primary";
  @Input() id: string;
  @Input() label: string;
  @Input() data: any[];
  @Input() type = 'text';
  @Input() placeholder: string
  @Input() desabilitar: boolean = false;
  @Input() retirarLabel: boolean = false;
  @Input() innerValue: any;
  @Input() tooltip: string;
  @Output() valorModificado = new EventEmitter();
  // @Input() isReadOnly = false;
  // @Input() control;

  // private innerValue: any;

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
      this.valorModificado.emit(v);
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
      this.value = false;
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