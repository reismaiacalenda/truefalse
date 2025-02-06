import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgxIpModule } from 'ngx-ip';
import { ModalModule } from '../../modal/modal.module';
import { ModalService } from '../../modal/modal.service';
import { AndaimeModule } from '../../../../../_andaime/andaime.module';
// import { RecursosAlocadosDataTableComponent } from './recursos-alocados-data-table/recursos-alocados-data-table.component';
// import { RecursosAlocadosComponent } from './recursos-alocados.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { CalendaNpsService } from './calenda-nps.service';
import { CalendaNpsFormComponent } from './calenda-nps-form/calenda-nps-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // Ng2AutoCompleteModule,
    ReactiveFormsModule,
    LayoutModule,
    HttpClientModule,
    // NgxDatatableModule,
    // RouterModule.forChild(routes),
    ModalModule,
    NgbModule,
    // NgxIpModule,
    AndaimeModule,
    InlineSVGModule
  ], exports: [
    RouterModule,
    CalendaNpsFormComponent
  ], declarations: [
    CalendaNpsFormComponent
  ],
  entryComponents: [
    CalendaNpsFormComponent
  ],
  providers: [
    CalendaNpsService,
    
  ]
})

export class CalendaNpsModule { }