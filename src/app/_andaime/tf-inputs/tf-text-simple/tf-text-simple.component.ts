import { Component, Input, forwardRef, Renderer2, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { globals, consoleLog } from '../../../globals';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

const TF_TEXT_SIMPLE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TfTextSimpleComponent),
  multi: true
};

@Component({
  selector: 'tf-text-simple',
  templateUrl: './tf-text-simple.component.html',
  //styleUrls: ['./input-field.component.css'],
  providers: [TF_TEXT_SIMPLE_VALUE_ACCESSOR],
  standalone: false
})

export class TfTextSimpleComponent implements ControlValueAccessor {
  @Input() control;
  @Input() mask: string = "";
  @Input() suffix: string = "";
  @Input() prefix: string = "";
  @Input() classeCss;
  @Input() id: string;
  @Input() label: string = "";
  @Input() campoDebug: string = "";
  @Input() type = 'text';
  @Input() placeholder: string = "";
  @Input() desabilitar: boolean = false;
  @Input() retirarLabel: boolean = false;
  @Input() tooltip: string;
  // @Input() isReadOnly = false;
  // @Input() isDisabled = false;

  private innerValue: any;

  constructor(private renderer: Renderer2, private el: ElementRef){
    // this.renderer.setProperty(this.el.nativeElement, 'disabled', true)
  }

  get value() {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChange(v);
    }
  }

  // setDisabledState(isDisabled: boolean) {
  //   this.renderer.setElementProperty(this.textInput.nativeElement, 'disabled', isDisabled);
  //   disable other components here
  // }

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
    // this.isDisabled = isDisabled;
    this.desabilitar = isDisabled;
    // this.renderer.setProperty(this.el.nativeElement, 'disabled', isDisabled)
  }

  debugGlobal = globals.debug;

}