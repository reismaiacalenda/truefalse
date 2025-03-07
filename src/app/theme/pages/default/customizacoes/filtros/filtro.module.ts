import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { FiltroComponent } from './filtro.component';
import { FiltroDataTableComponent } from './filtro-data-table/filtro-data-table.component';
// import { DataTableModule } from 'angular-4-data-table/src/index';
// import { DataTableDemo2 } from './demo2/data-table-demo2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FiltroFormComponent } from './filtro-form/filtro-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgxIpModule } from 'ngx-ip';
import { ModalModule } from '../../modal/modal.module';
import { ModalService } from '../../modal/modal.service';
import { AndaimeModule } from '../../../../../_andaime/andaime.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { InlineSVGModule } from 'ng-inline-svg-2';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: FiltroComponent, children: [
          { path: 'new', component: FiltroFormComponent },
          { path: ':id', component: FiltroFormComponent }
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
    NgbModule, //ovo,
    NgxIpModule,
    ModalModule,
    InlineSVGModule.forRoot(),
    AndaimeModule,
    NgSelectModule
  ], exports: [
    RouterModule
  ], declarations: [
    FiltroComponent,
    FiltroDataTableComponent,
    FiltroFormComponent,
  ],
  entryComponents: [
    FiltroFormComponent,
  ],
  providers: [
    ModalService
  ]
})
export class FiltroModule { }
