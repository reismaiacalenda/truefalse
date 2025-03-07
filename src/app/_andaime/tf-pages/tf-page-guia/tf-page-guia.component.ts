import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkspaceService } from '../../../_services/workspace.service';

declare function abrirChat(): any;

const TF_PAGE_FAQ_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TfPageFaqComponent),
  multi: true
};

@Component({
  selector: 'tf-page-guia',
  templateUrl: './tf-page-guia.component.html',
  providers: [TF_PAGE_FAQ_VALUE_ACCESSOR],
  standalone: false
})

export class TfPageFaqComponent implements ControlValueAccessor {

  @Input() label: string;
  @Input() isReadOnly = false;
  // @Input() classeCss;
  // @Input() id: string;
  // @Input() type = 'text';
  // @Input() placeholder: string;

  constructor(
    private _router: Router,
    public workspaceService: WorkspaceService,){}

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
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isReadOnly = isDisabled;
  }

  validarCss(valid){
    if(valid){
      return 'has-success';
    }else{
      return 'has-danger';
    }
  }

  iniciarTour(){
    this._router.navigate(['/'], {queryParams: {tour: true}})
  }

  onAbrirChat(){
		abrirChat()
	}

}