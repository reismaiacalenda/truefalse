import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgModule } from '@angular/core';
import { inputSelection } from 'ngx-ip/src/utils';
import { consoleLog, globals } from '../../../globals';
import { Subject } from 'rxjs';

const TF_TIME_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TfTimeComponent),
  multi: true
};

@Component({
  selector: 'tf-time',
  templateUrl: './tf-time.component.html',
  //styleUrls: ['./input-field.component.css'],
  providers: [TF_TIME_VALUE_ACCESSOR]
})

export class TfTimeComponent implements ControlValueAccessor {

  @Input() mask: string;
  @Input() classeCss;
  @Input() id: string;
  @Input() label: string;
  @Input() type = 'text';
  @Input() placeholder: string;
  @Input() desabilitar: boolean = false;
  @Input() retirarLabel: boolean = false;
  @Input() step:string =  '60';
  @Input() tooltip: string;
  @Output() valorModificado = new EventEmitter();
  customInput : Subject<string> = new Subject();


  // @Input() isReadOnly = false;
  // @Input() control;

  // timepickerVisible = false;
  // mytime: Date;

  constructor(){
    this.customInput.debounceTime(600).distinctUntilChanged().subscribe(value =>{
      this.valorModificado.emit(value);
   });  }

  private innerValue: any = "00:00";

  get value() {
    return this.innerValue;
  }

  set value(v: any) {
    // consoleLog('oi?')
    // consoleLog(v);
    // consoleLog(this.innerValue)
    // consoleLog(v !== this.innerValue);
    // consoleLog(v != this.innerValue);
    if (v !== this.innerValue) {
      // if (v.length == 5){

        // var split = v.split(":");
        // consoleLog(split);
        // consoleLog(split[1])
        // if (split[1] == "03"){
        //   v = split[0] + ":30";
        // }
        // else if(split[1] != "00" || split[1][0] != "30"){
        //   consoleLog("caiu aqui")
        //   v = split[0] + ":00";
        //   consoleLog(v);
        // }
        this.innerValue = v;
        // consoleLog(this.innerValue);
        this.onChangeCb(v);
      // }
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

  modelChange(event){
    this.customInput.next(event);
  }

  debugGlobal = globals.debug;

}