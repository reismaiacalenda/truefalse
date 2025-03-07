import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { EspacoComponent } from './espaco.component';
import { EspacoDataTableComponent } from './espaco-data-table/espaco-data-table.component';
// import { DataTableModule } from 'angular-4-data-table/src/index';
// import { DataTableDemo2 } from './demo2/data-table-demo2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { EspacoFormComponent } from './espaco-form/espaco-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgxIpModule } from 'ngx-ip';
import { ModalModule } from '../../../modal/modal.module';
import { ModalService } from '../../../modal/modal.service';
import { AndaimeModule } from '../../../../../../_andaime/andaime.module';
import { EspacoFormLoteComponent } from './espaco-form-lote/espaco-form-lote.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AmenitiesInstalledModule } from '../amenities-installed/amenities-installed.module';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: EspacoComponent, children: [
          { path: 'new', component: EspacoFormComponent },
          { path: ':id', component: EspacoFormComponent }
        ]
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2AutoCompleteModule,
    ReactiveFormsModule,
    LayoutModule,
    HttpClientModule,
    NgxDatatableModule,
    RouterModule.forChild(routes),
    InlineSVGModule.forRoot(),
    NgbModule, //ovo,
    NgxIpModule,
    ModalModule,
    AmenitiesInstalledModule,
    AndaimeModule
  ], exports: [
    RouterModule
  ], declarations: [
    EspacoComponent,
    EspacoDataTableComponent,
    EspacoFormComponent,
    EspacoFormLoteComponent,
  ],
  entryComponents: [
    EspacoFormComponent,
    EspacoFormLoteComponent,
  ],
  providers: [
    ModalService
  ]
})
export class EspacoModule { }
