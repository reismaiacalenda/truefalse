import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
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
import { CheckModalService } from '../checks-modal/check-modal.service';
import { InlineSVGModule } from 'ng-inline-svg';
import { AgendadorComponent } from './agendador.component';
import { AgendaModule } from '../calendario/agenda.module';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: AgendadorComponent, children: [
          // { path: 'new', component: RecursosAlocadosFormComponent },
          // { path: ':id', component: RecursosAlocadosFormComponent }
        ]
      }
    ]
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // Ng2AutoCompleteModule,
    ReactiveFormsModule,
    LayoutModule,
    HttpClientModule,
    // NgxDatatableModule,
    RouterModule.forChild(routes),
    NgbModule,
    // NgxIpModule,
    ModalModule,
    AndaimeModule,
    InlineSVGModule
  ], exports: [
    RouterModule
  ], declarations: [
    AgendadorComponent
  ],
  entryComponents: [
  ],
  providers: [
    // ModalService,
    // CheckModalService
  ]
})
export class AgendadorModule { }
