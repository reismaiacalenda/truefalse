import { HttpClientModule } from '@angular/common/http';
// import { OvoDebugComponent } from './../../ovo/ovo-debug/ovo-debug.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { ConfiguracaoComponent } from './configuracao.component';
// import { DataTableModule } from 'angular-4-data-table/src/index';
// import { DataTableDemo2 } from './demo2/data-table-demo2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgxIpModule } from 'ngx-ip';
import { ModalModule } from '../../../modal/modal.module';
import { ModalService } from '../../../modal/modal.service';
import { AndaimeModule } from '../../../../../../_andaime/andaime.module';
import {ConfiguracaoFormComponent} from './configuracao-form/configuracao-form.component';
import { ConfiguracaoDataTableComponent } from './configuracao-data-table/configuracao-data-table.component';
const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: ConfiguracaoComponent, children: [
          { path: 'new', component: ConfiguracaoFormComponent },
          { path: ':id', component: ConfiguracaoFormComponent }
        ]
      }
    ]
  }
];

//acrescentei módulo legal pro instituicao

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
    ConfiguracaoComponent,
    ConfiguracaoDataTableComponent,
    ConfiguracaoFormComponent,
  ],
  entryComponents: [
    ConfiguracaoFormComponent,
  ],
  providers: [
    ModalService
  ]
})
export class ConfiguracaoModule { }
