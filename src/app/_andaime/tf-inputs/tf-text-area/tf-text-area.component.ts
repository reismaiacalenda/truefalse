import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { globals } from '../../../globals';

const TF_TEXT_AREA_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TfTextAreaComponent),
  multi: true
};

@Component({
  selector: 'tf-text-area',
  templateUrl: './tf-text-area.component.html',
  //styleUrls: ['./input-field.component.css'],
  providers: [TF_TEXT_AREA_VALUE_ACCESSOR],
  standalone: false
})

export class TfTextAreaComponent implements ControlValueAccessor {
  @Input() control;
  @Input() mask: string = "";
  @Input() suffix: string = "";
  @Input() prefix: string = "";
  @Input() classeCss;
  @Input() id: string;
  @Input() label: string = "";
  @Input() type = 'text';
  @Input() placeholder: string = "";
  @Input() desabilitar: boolean = false;
  @Input() rows: number = 3;
  @Input() retirarLabel: boolean = false;
  @Input() tooltip: string;
  // @Input() isReadOnly = false;

  private innerValue: any;

  get value() {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChange(v);
    }
  }

  onChange: (_: any) => void = () => {};

  onTouched: (_: any) => void = () => {};

  onBlur(){
    this.onTouched(this.value);
  }

  writeValue(v: any): void {
    this.value = v;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.desabilitar = isDisabled;
  }
  
  debugGlobal = globals.debug;
  
}