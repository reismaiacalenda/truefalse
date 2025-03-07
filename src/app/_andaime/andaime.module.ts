import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// import { ImageUploadModule } from 'angular2-image-upload';
import { MaskDateDirective } from '../_directives/mask-date.directive';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbDateMomentParserFormatter } from './tf-inputs/tf-date/ngb-date-moment-parser-formatter';
import { NgbModule, NgbDatepickerModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
// import { NgxBrModule } from '@nbfontana/ngx-br';
// import { NgxCurrencyModule } from 'ngx-currency';
// import { NgxMaskModule, IConfig } from 'ngx-mask';
// import { BrowserModule } from '@angular/platform-browser';
// import { DropdownService } from './services/dropdown.service';
// import { CampoControlErroComponent } from './campo-control-erro/campo-control-erro.component';
// import { FormDebugComponent } from './form-debug/form-debug.component';
// import { ErrorMsgComponent } from './error-msg/error-msg.component';
// import { BaseFormComponent } from './base-form/base-form.component';
import { ModalModule } from '../theme/pages/default/modal/modal.module';
import { ModalService } from '../theme/pages/default/modal/modal.service';
// import { NgSelect2Module } from 'ng-select2';
// import { NgSelectModule } from '@ng-select/ng-select';
import { TfCheckBoxComponent } from './tf-inputs/tf-check-box/tf-check-box.component';
import { TfCheckListComponent } from './tf-inputs/tf-check-list/tf-check-list.component';
import { TfDateComponent } from './tf-inputs/tf-date/tf-date.component';
import { TfFloatComponent } from './tf-inputs/tf-float/tf-float.component';
import { TfFormAbasComponent } from './tf-forms/tf-form-abas/tf-form-abas.component';
import { TfFormSimplesComponent } from './tf-forms/tf-form-simples/tf-form-simples.component';
import { TfUploadImageComponent } from './tf-inputs/tf-upload-image/tf-upload-image.component';
import { TfIntegerComponent } from './tf-inputs/tf-integer/tf-integer.component';
import { TfMoneyComponent } from './tf-inputs/tf-money/tf-money.component';
import { TfPageFaqComponent } from './tf-pages/tf-page-guia/tf-page-guia.component';
import { TfPageMapComponent } from './tf-pages/tf-page-map/tf-page-map.component';
import { TfRadioButtonComponent } from './tf-inputs/tf-radio-button/tf-radio-button.component';
import { TfTextAreaComponent } from './tf-inputs/tf-text-area/tf-text-area.component';
import { TfTextSimpleComponent } from './tf-inputs/tf-text-simple/tf-text-simple.component';
import { TfTimeComponent } from './tf-inputs/tf-time/tf-time.component';
import { TfSelectSimpleComponent } from './tf-inputs/tf-select-simple/tf-select-simple.component';
import { TfDatatableCabecalhoComponent } from './tf-datatable/tf-datatable-cabecalho/tf-datatable-cabecalho.component';
import { TfSelectMultiComponent } from './tf-inputs/tf-select-multi/tf-select-multi.component';
import { TfSelectEmailComponent } from './tf-inputs/tf-select-email/tf-select-email.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { RouterModule } from '@angular/router';
// import { NgSelectModule } from '@ng-select/ng-select';

// export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    // BrowserModule,
    CommonModule,
    FormsModule,
    // ImageUploadModule.forRoot(),
    // ModalModule,
    NgbDatepickerModule,
    NgbModule,
    // NgSelect2Module,
    // NgSelectModule,
    // NgxBrModule.forRoot()
    // NgxMaskModule.forRoot(options), 
    ReactiveFormsModule,
    InlineSVGModule,
    RouterModule,
  ],
  declarations: [
    // CampoControlErroComponent,
    // ErrorMsgComponent,
    // FormDebugComponent,
    // MaskDateDirective,
    TfCheckBoxComponent,
    TfCheckListComponent,
    TfDatatableCabecalhoComponent,
    TfDateComponent,
    TfFloatComponent,
    TfFormSimplesComponent,
    TfFormAbasComponent,
    TfUploadImageComponent,
    TfIntegerComponent,
    TfMoneyComponent,    
    TfPageFaqComponent,
    TfPageMapComponent, 
    TfRadioButtonComponent,
    TfSelectEmailComponent,
    TfSelectMultiComponent,
	  TfSelectSimpleComponent,
    TfTextAreaComponent,
    TfTextSimpleComponent,
    TfTimeComponent,
  ],
  exports: [
    // CampoControlErroComponent,
    // ErrorMsgComponent,
    // FormDebugComponent, 
    // MaskDateDirective, 
    TfCheckBoxComponent,
    TfCheckListComponent,
    TfDatatableCabecalhoComponent,
    TfDateComponent,
    TfFloatComponent,
    TfFormAbasComponent,
    TfFormSimplesComponent,
    TfUploadImageComponent,
    TfIntegerComponent,
    TfMoneyComponent,    
    TfPageFaqComponent,
    TfPageMapComponent, 
    TfRadioButtonComponent,
    TfSelectEmailComponent,
    TfSelectMultiComponent,
    TfSelectSimpleComponent,
    TfTextAreaComponent,
    TfTextSimpleComponent,
    TfTimeComponent
    ],
  providers: [ 
    NgbDateMomentParserFormatter,
    {provide: NgbDateParserFormatter,
    useClass: NgbDateMomentParserFormatter},
    ModalService
   ]//,
    // bootstrap: [TimeComponent]
    ,  schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
      NO_ERRORS_SCHEMA
    ]
})
export class AndaimeModule { }
