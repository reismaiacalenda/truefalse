import { Component, Input, forwardRef, ViewChild, ElementRef, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbDate, NgbModule, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateMomentParserFormatter } from './ngb-date-moment-parser-formatter';
import { consoleLog, globals } from '../../../globals';
import { CommonModule } from '@angular/common';


const TF_DATE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TfDateComponent),
  multi: true
};

@Component({
  selector: 'tf-date',
  templateUrl: './tf-date.component.html',
  //styleUrls: ['./input-field.component.css'],
  providers: [TF_DATE_VALUE_ACCESSOR],
  standalone: false
})

export class TfDateComponent implements ControlValueAccessor{

  @Input() classeCss;
  @Input() id: string;
  @Input() label: string;
  @Input() type = 'text';
  @Input() placeholder: string;
  @Input() desabilitar: boolean = false;
  @Input() exibirIcone: boolean = false;
  @Input() optgroup:boolean = false;
  @Input() retirarLabel: boolean = false;
  @Input() datasAntigas: boolean = false;
  @Input() tooltip: string;
  @Output() valorModificado = new EventEmitter();
  @ViewChild('d', {static:false}) d: ElementRef;
  // @Input() isReadOnly = false; 
  
  public model: any;
  public today;
  public _value: string;
  private isValueChangeFromFormService:boolean = true;

  constructor(private calendar: NgbCalendar,
    private ngbParser: NgbDateMomentParserFormatter){
    this.today = this.calendar.getToday();
  }

  get value() {
    return this._value;
  }

  set value(v: any) {
    // consoleLog("chamou o set value para prencher o valor:");
    // consoleLog(v);
    if (typeof v == "object"){
      v = this.ngbParser.format(v);
    }
    if (v !== this._value) {
      this._value = v;
      this.model = this.ngbParser.parse(this._value);
      this.onChangeCb(v);
    }
  }

  modelChange(eventValue){
    // consoleLog("ciau no modelchange, recebendo:")
    if (!eventValue){
      this.value = null
    } else {
      if (typeof eventValue == "object"){
        eventValue = this.ngbParser.format(eventValue);
      }
      if (eventValue.replace(/[^0-9.]/g, "").length == 8){
        this.value = eventValue.split("_")[0];
        // d.close();
      }
    }
  }

  valueChanged(event){
    consoleLog("value change tfdate");
    this.isValueChangeFromFormService=false;
    this.value = parseInt(event.value);
    this.onTouchedCb(this.model)
    if (this.optgroup){
      var optgroup_value = event.data[0].element.parentNode.value;
      this.valorModificado.emit({value: this.value, optgroup: optgroup_value});
    } else {
      this.valorModificado.emit(this.value);
    }
    this.isValueChangeFromFormService=true;
  }

  //TODO VALIDACAO FORMATO E CONTEUDO INVÁLIDO E MIN MAX RANGE
  // /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(eventValue);

  onFocus(d){
    // this.d.nativeElement.open();
    // consoleLog("focus");
    // consoleLog(d);
    
    if (!this.desabilitar){
      d.open();
    }
  }

  onClick(){
    // consoleLog("click");
  }

  setToday(){
    // consoleLog("set today");
    // consoleLog(this.today);
    this.value = this.today;
    // d.navigateTo(this.value);
  }

  onChangeCb: (_: any) => void = () => {};
  
  onTouchedCb: (_: any) => void = () => {};

  writeValue(v: any): void {
    this.value = v;
  }

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
    if (this.value == null){
      this.setToday();
    }
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.desabilitar = isDisabled;
  }

  debugGlobal = globals.debug;

  abrirCalendario(d){
    if (!this.desabilitar){
      d.toggle();
    }
  }

  dataMinimina(){
    if (this.datasAntigas == true){
      return undefined;
    }else{
      return this.today;
    }
  }
}