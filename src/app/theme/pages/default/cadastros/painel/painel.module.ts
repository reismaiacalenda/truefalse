import { HttpClientModule } from '@angular/common/http';
// import { OvoDebugComponent } from './../../ovo/ovo-debug/ovo-debug.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { PainelComponent } from './painel.component';
import { PainelDataTableComponent } from './painel-data-table/painel-data-table.component';
// import { DataTableModule } from 'angular-4-data-table/src/index';
// import { DataTableDemo2 } from './demo2/data-table-demo2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PainelFormComponent } from './painel-form/painel-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { ConfirmacaoModalComponent } from '../../modal/confirmacao-modal/confirmacao-modal.component';
import { ModalModule } from '../../modal/modal.module';
import { ModalService } from '../../modal/modal.service';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: PainelComponent, children: [
          { path: 'new', component: PainelFormComponent },
          { path: ':id', component: PainelFormComponent }
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
    ModalModule
  ], exports: [
    RouterModule
  ], declarations: [
    PainelComponent,
    PainelDataTableComponent,
    PainelFormComponent,
  ],
  entryComponents: [
    PainelFormComponent,
  ],
  providers: [
    ModalService
  ]
})
export class PainelModule { }
