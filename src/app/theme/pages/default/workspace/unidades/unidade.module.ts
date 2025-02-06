import { HttpClientModule } from '@angular/common/http';
// import { OvoDebugComponent } from './../../ovo/ovo-debug/ovo-debug.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { UnidadeComponent } from './unidade.component';
import { UnidadeDataTableComponent } from './unidade-data-table/unidade-data-table.component';
// import { DataTableModule } from 'angular-4-data-table/src/index';
// import { DataTableDemo2 } from './demo2/data-table-demo2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UnidadeFormComponent } from './unidade-form/unidade-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgxIpModule } from 'ngx-ip';
import { ModalModule } from '../../modal/modal.module';
import { ModalService } from '../../modal/modal.service';
import { AndaimeModule } from '../../../../../_andaime/andaime.module';
const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: UnidadeComponent, children: [
          { path: 'new', component: UnidadeFormComponent },
          { path: ':id', component: UnidadeFormComponent }
        ]
      }
    ]
  }
];

//acrescentei módulo legal pro unidade

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
    AndaimeModule
  ], exports: [
    RouterModule
  ], declarations: [
    UnidadeComponent,
    UnidadeDataTableComponent,
    UnidadeFormComponent,
  ],
  entryComponents: [
    UnidadeFormComponent,
  ],
  providers: [
    ModalService
  ]
})
export class UnidadeModule { }
