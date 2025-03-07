import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { RecursoComponent } from './recurso.component';
import { RecursoDataTableComponent } from './recurso-data-table/recurso-data-table.component';
// import { DataTableModule } from 'angular-4-data-table/src/index';
// import { DataTableDemo2 } from './demo2/data-table-demo2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RecursoFormComponent } from './recurso-form/recurso-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgxIpModule } from 'ngx-ip';
import { ModalModule } from '../../../modal/modal.module';
import { ModalService } from '../../../modal/modal.service';
import { AndaimeModule } from '../../../../../../_andaime/andaime.module';
import { AnQrcodeModule } from 'an-qrcode';
import { InlineSVGModule } from 'ng-inline-svg-2';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: RecursoComponent, children: [
          { path: 'new', component: RecursoFormComponent },
          { path: ':id', component: RecursoFormComponent }
        ]
      }
    ]
  }
];
@NgModule({
  imports: [
    AnQrcodeModule,
    CommonModule,
    FormsModule,
    Ng2AutoCompleteModule,
    ReactiveFormsModule,
    LayoutModule,
    HttpClientModule,
    NgxDatatableModule,
    RouterModule.forChild(routes),
    NgbModule,
    NgxIpModule,
    ModalModule,
    AndaimeModule,
    InlineSVGModule
  ], exports: [
    RouterModule
  ], declarations: [
    RecursoComponent,
    RecursoDataTableComponent,
    RecursoFormComponent
  ],
  entryComponents: [
    RecursoFormComponent
  ],
  providers: [
    ModalService
  ]
})
export class RecursoModule { }
