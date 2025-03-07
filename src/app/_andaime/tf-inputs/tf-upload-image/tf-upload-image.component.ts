import { Component, Input, forwardRef, Renderer2, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { consoleLog, globals } from '../../../globals';

const TF_UPLOAD_IMAGE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TfUploadImageComponent),
  multi: true
};

@Component({
  selector: 'tf-upload-image',
  templateUrl: './tf-upload-image.component.html',
  //styleUrls: ['./input-field.component.css'],
  providers: [TF_UPLOAD_IMAGE_VALUE_ACCESSOR],
  standalone: false
})

export class TfUploadImageComponent implements ControlValueAccessor {

  @Input() label: string;
  @Input() retirarLabel: boolean = false;
  @Input() labelBotao:string = "Upload";
  @Input() boxMessage:string = "arraste aqui as imagens!"
  @Input() extensions:any[];
  @Input() desabilitar: boolean = false;
  @Input() carousel:any[] = [];
  @Input() max = 1;
  @Input() tooltip: string;
  @Output() upload = new EventEmitter();
  @Output() remove = new EventEmitter();
  @ViewChild('tfImageUpload', {static: false}) tfImageUpload;

  private innerValue: any;

  selectedFile = null;

  onUploadFinished(file: any) {
    consoleLog("onuploadfins")
    consoleLog(file);
    this.upload.emit(this.tfImageUpload);
  }
  
  onRemoved(file: any) {
    consoleLog("onRemoved")
    consoleLog(file);
    this.remove.emit(file);
  }
  
  onUploadStateChanged(state: boolean) {
    consoleLog("onUploadStateChanged")
    consoleLog(state);
  }

  constructor(private renderer: Renderer2, private el: ElementRef){
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