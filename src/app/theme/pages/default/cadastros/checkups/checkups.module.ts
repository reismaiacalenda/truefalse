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
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CheckupsService } from './checkups.service';
import { CheckupCovidFormComponent } from './checkup-covid-form/checkup-covid-form.component';
import { VacinadoFormComponent } from './vacinado-form/vacinado-form.component';
import { BurnoutFormComponent } from './burnout-form/burnout-form.component';
import { CheckupsComponent } from './checkups.component';
import { CheckupFormComponent } from './checkup-form/checkup-form.component';

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
    CheckupsComponent,
    CheckupCovidFormComponent,
    CheckupFormComponent,
    VacinadoFormComponent,
    BurnoutFormComponent
  ], declarations: [
    CheckupsComponent,
    CheckupCovidFormComponent,
    CheckupFormComponent,
    VacinadoFormComponent,
    BurnoutFormComponent
  ],
  entryComponents: [
    CheckupsComponent,
    CheckupCovidFormComponent,
    CheckupFormComponent,
    VacinadoFormComponent,
    BurnoutFormComponent
  ],
  providers: [
    CheckupsService,
    
  ]
})

export class CheckupsModule { }