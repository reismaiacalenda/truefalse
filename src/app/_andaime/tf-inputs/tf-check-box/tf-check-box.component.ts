import { Component, Input, forwardRef, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { globals } from '../../../globals';

const TF_CHECK_BOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TfCheckBoxComponent),
  multi: true
};

@Component({
  selector: 'tf-check-box',
  templateUrl: './tf-check-box.component.html',
  providers: [TF_CHECK_BOX_VALUE_ACCESSOR],
  standalone: false
})

export class TfCheckBoxComponent implements ControlValueAccessor {

  @Input() classeCss;
  @Input() id: string;
  @Input() label: string;
  @Input() type = 'text';
  @Input() desabilitar: boolean = false;
  @Input() retirarLabel: boolean = false;
  @Input() tooltip: string;
  // @Input() data: any[];
  // @Input() placeholder: string;
  // @Input() control;
  // @Input() isReadOnly = false;

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