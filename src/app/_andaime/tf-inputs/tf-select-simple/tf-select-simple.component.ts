import { Component, Input, forwardRef, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { consoleLog, globals } from '../../../globals';

const TF_SELECT_SIMPLE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TfSelectSimpleComponent),
  multi: true
};

@Component({
  selector: 'tf-select-simple',
  templateUrl: './tf-select-simple.component.html',
  standalone: false,
  //styleUrls: ['./input-field.component.css'],
  providers: [TF_SELECT_SIMPLE_VALUE_ACCESSOR]
})

export class TfSelectSimpleComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  @Input() control;
  @Input() id: string;
  @Input() label: string = "";
  @Input() placeholder: string = "";
  @Input() isReadOnly = false;
  @Input() formControl:FormControl;
  @Input() optgroup:boolean = false;
  @Input() allowClear = false;
  @Input() options:any = {
    multiple: false,
    tags: false,
    width: '100%'
  }
  // containerCss: 'm-input m-input--air'
  @Input() data;
  @Input() retirarLabel: boolean = false;
  @Input() desabilitar: boolean = false;
  @Input() tooltip: string;
  @Input() testex: boolean = true
  @Output() valorModificado = new EventEmitter();
  
  private isValueChangeFromFormService:boolean = true;
  private subscriptions: Subscription = new Subscription();

  public model;

  private innerValue: any;

  teste(q){
    consoleLog("ovo")
    consoleLog(q);
  }

  constructor(public formBuilder: FormBuilder){
    this.formControl = this.formBuilder.control({})
  }

  ngOnInit(){
    // this.subscriptions.add(
    //   this.formControl.valueChanges.subscribe(value=>{
    //     // consoleLog("we are thce chamipios")
    //     // consoleLog(value);
    //     if (this.isValueChangeFromFormService){
    //       this.model = this.valueToModel(this.formControl.value);
    //     }
    //   })
    // )
  }

  ngOnDestroy(){
    // this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(){
    // consoleLog("on afterinit");
    // if (this.value){
    // this.valueToModel(this.value);
    // }
  }

  valueChanged(event){
    this.isValueChangeFromFormService=false;

    consoleLog("event");
    consoleLog(event);
    consoleLog("pagable_type:")
    consoleLog("value");
    consoleLog(this.value)
    consoleLog("model");
    consoleLog(this.model);
    
    // if (this.intParsable){
    if (typeof event.value === "number"){
      consoleLog("É inteiro")
      this.value = parseInt(event.value);
    }else{
      consoleLog("Não é inteiro")
      this.value = event.value
    }
    // this.formControl.setValue(this.value);
    // this.formControl.updateValueAndValidity();
    consoleLog("Value após parse");
    consoleLog(this.value);
    consoleLog("model");
    consoleLog(this.model);
    this.onTouchedCb(this.model) // antes era onTouched, antes de tratar aplicaCss
    if (this.optgroup){
      var optgroup_value = event.data[0].element.parentNode.value;
      this.valorModificado.emit({value: this.value, optgroup: optgroup_value});
    }else{
      this.valorModificado.emit(this.value);
    }
    this.isValueChangeFromFormService=true;
  }

  valueToModel(v){
    this.model = v
  }

  get value() {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChange(v);
      this.valueToModel(v)
    }
  }

  onChange: (_: any) => void = () => {};

  // onTouched: (_: any) => void = () => {};

  onTouchedCb: (_: any) => void = () => {};

  // onBlur(){
  //   this.onTouched(this.value);
  // }

  writeValue(v: any): void {
    this.value = v;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // this.onTouched = fn;
    this.onTouchedCb = fn;
  }

  handleClear(){
    //this.model= ' ';
    this.formControl.setValue(null);
  }


  setDisabledState?(isDisabled: boolean): void {
    this.desabilitar = isDisabled;
  }

  debugGlobal = globals.debug;

}
