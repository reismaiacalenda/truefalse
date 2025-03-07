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
import { AndaimeModule } from '../../../../../_andaime/andaime.module';
import { GuiaComponent } from './guia.component';
import { InlineSVGModule } from 'ng-inline-svg-2';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: GuiaComponent, children: [
          { path: 'new', component: GuiaComponent },
          { path: ':id', component: GuiaComponent }
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
    AndaimeModule,
    InlineSVGModule.forRoot()
  ], exports: [
    RouterModule,
    GuiaComponent
  ], declarations: [
    GuiaComponent,
        // InstituicaoDataTableComponent,
    // InstituicaoFormComponent,
  ],
  entryComponents: [
    // InstituicaoFormComponen
    GuiaComponent,
  ],
  providers: [
    ModalService
  ],
  bootstrap: [
    GuiaComponent
  ]
})
export class GuiaModule { }
