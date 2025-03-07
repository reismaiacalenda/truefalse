import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { consoleLog, globals } from '../../../globals';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tf-time',
  templateUrl: './tf-time.component.html',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TfTimeComponent),
      multi: true
    }
  ]
})
export class TfTimeComponent implements ControlValueAccessor {
  @Input() mask?: string;
  @Input() classeCss?: string;
  @Input() id?: string;
  @Input() label?: string;
  @Input() type = 'text';
  @Input() placeholder?: string;
  @Input() desabilitar = false;
  @Input() retirarLabel = false;
  @Input() step = '60';
  @Input() tooltip?: string;
  @Output() valorModificado = new EventEmitter<string>();
  
  private customInput = new Subject<string>();
  private innerValue = "00:00";
  debugGlobal = globals.debug;

  constructor() {
    this.customInput.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ).subscribe(value => {
      this.valorModificado.emit(value);
    });
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
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.desabilitar = isDisabled;
  }

  modelChange(event: any) {
    this.customInput.next(event);
  }
}