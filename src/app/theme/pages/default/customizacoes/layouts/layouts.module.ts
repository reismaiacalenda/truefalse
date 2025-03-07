import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgxIpModule } from 'ngx-ip';
// import { RecursosAlocadosDataTableComponent } from './recursos-alocados-data-table/recursos-alocados-data-table.component';
// import { RecursosAlocadosComponent } from './recursos-alocados.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LayoutsComponent } from './layouts.component';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { ModalModule } from '../../modal/modal.module';
import { AndaimeModule } from '../../../../../_andaime/andaime.module';
const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: LayoutsComponent, children: [
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
    LayoutsComponent
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class LayoutsModule { }
