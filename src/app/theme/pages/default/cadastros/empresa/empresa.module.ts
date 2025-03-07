import { HttpClientModule } from '@angular/common/http';
// import { OvoDebugComponent } from './../../ovo/ovo-debug/ovo-debug.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { EmpresaComponent } from './empresa.component';
import { EmpresaDataTableComponent } from './empresa-data-table/empresa-data-table.component';
// import { DataTableModule } from 'angular-4-data-table/src/index';
// import { DataTableDemo2 } from './demo2/data-table-demo2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { EmpresaFormComponent } from './empresa-form/empresa-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { ModalModule } from '../../modal/modal.module';
import { ModalService } from '../../modal/modal.service';
import { NgSelect2Module } from 'ng-select2';
import { NgxMaskModule, IConfig } from 'ngx-mask';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: EmpresaComponent, children: [
          { path: 'new', component: EmpresaFormComponent },
          { path: ':id', component: EmpresaFormComponent }
        ]
      }
    ]
  }
];

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};


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
    NgbModule, 
    ModalModule,
    NgSelect2Module,
    NgxMaskModule.forRoot(options)
  ], exports: [
    RouterModule
  ], declarations: [
    EmpresaComponent,
    EmpresaDataTableComponent,
    EmpresaFormComponent,
  ],
  entryComponents: [
    EmpresaFormComponent,
  ],
  providers: [
    ModalService
  ]
})
export class EmpresaModule { }
