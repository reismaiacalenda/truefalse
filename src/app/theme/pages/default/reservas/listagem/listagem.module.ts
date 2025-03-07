import { HttpClientModule } from '@angular/common/http';
// import { OvoDebugComponent } from './../../ovo/ovo-debug/ovo-debug.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
// import { DataTableModule } from 'angular-4-data-table/src/index';
// import { DataTableDemo2 } from './demo2/data-table-demo2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgxIpModule } from 'ngx-ip';
import { ModalModule } from '../../modal/modal.module';
import { ModalService } from '../../modal/modal.service';
import { ListagemComponent } from './listagem.component';
import { ListagemDataTableComponent } from './listagem-data-table/listagem-data-table.component';
import { AndaimeModule } from '../../../../../_andaime/andaime.module';
import { NgxCollapseModule } from 'ngx-collapse';
import { ReservaModalService } from '../reserva-modal/reserva-modal.service';
import { CheckModalService } from '../checks-modal/check-modal.service';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AgendarDropdownModule } from '../agendar-dropdown/agendar-dropdown.module';
// import { AgendaModule } from '../agenda/agenda.module';
// import { AgendaFormComponent } from '../agenda/agenda-form/agenda-form.component';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: ListagemComponent, children: [
          // {
          //   "path": "",
          //   "component": AgendaFormComponent,
          //   children: [
          //     { path: ':id', component: AgendaFormComponent }
          //   ]
          // }
          // { path: 'new', component: ReservaFormComponent },
          // { path: ':id', component: ReservaFormComponent }
        ]
      }
    ]
  }
];

//acrescentei módulo legal pro reserva

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2AutoCompleteModule,
    ReactiveFormsModule,
    NgxCollapseModule,
    LayoutModule,
    HttpClientModule,
    NgxDatatableModule,
    RouterModule.forChild(routes),
    NgbModule, //ovo,
    NgxIpModule,
    ModalModule,
    AndaimeModule,
    InlineSVGModule,
    AgendarDropdownModule
    // AgendaModule
  ], exports: [
    RouterModule
  ], declarations: [
    ListagemComponent,
    ListagemDataTableComponent
    // ReservaDataTableComponent,
  ],
  entryComponents: [
    // AgendaFormComponent
  ],
  providers: [
    ModalService,
    ReservaModalService,
    CheckModalService
  ]
})
export class ListagemModule { }
