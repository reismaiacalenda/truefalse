import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from './../../default.component';
import { ExameComponent } from './exame.component';
import { ExameDataTableComponent } from './exame-data-table/exame-data-table.component';
// import { DataTableModule } from 'angular-4-data-table/src/index';
// import { DataTableDemo2 } from './demo2/data-table-demo2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ExameFormComponent } from './exame-form/exame-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgxIpModule } from 'ngx-ip';
import { ModalModule } from '../../modal/modal.module';
import { ModalService } from '../../modal/modal.service';
import { AndaimeModule } from './../../../../../_andaime/andaime.module';
import { InlineSVGModule } from 'ng-inline-svg-2';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: ExameComponent, children: [
          { path: 'new', component: ExameFormComponent },
          { path: ':id', component: ExameFormComponent }
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
    AndaimeModule,
    InlineSVGModule.forRoot(),
  ], exports: [
    RouterModule
  ], declarations: [
    ExameComponent,
    ExameDataTableComponent,
    ExameFormComponent,
  ],
  entryComponents: [
    ExameFormComponent,
  ],
  providers: [
    ModalService
  ]
})
export class ExameModule { }
