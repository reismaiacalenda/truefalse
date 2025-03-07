import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../default.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgxIpModule } from 'ngx-ip';
import { ModalModule } from '../modal/modal.module';
import { ModalService } from '../modal/modal.service';
import { AndaimeModule } from '../../../../_andaime/andaime.module';
// import { RecursosAlocadosDataTableComponent } from './recursos-alocados-data-table/recursos-alocados-data-table.component';
// import { RecursosAlocadosComponent } from './recursos-alocados.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { WorkspaceComponent } from './workspace.component';
import { LicencaComponent } from './licenca/licenca.component';
import { DegustacaoComponent } from './degustacao/degustacao.component';
import { MeuWorkspaceComponent } from './meu-workspace/meu-workspace.component';
import { ClienteFormComponent } from './meu-workspace/cliente-form/cliente-form.component';
import { CostumerSuccessComponent } from './costumer-success/costumer-success.component';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: WorkspaceComponent, children: [
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
    InlineSVGModule,
  ], exports: [
    RouterModule
  ], declarations: [
    WorkspaceComponent,
    LicencaComponent,
    DegustacaoComponent,
    MeuWorkspaceComponent,
    ClienteFormComponent
  ],
  entryComponents: [
    ClienteFormComponent
  ],
  providers: [
    // ModalService,
    // CheckModalService
  ]
})
export class WorkspaceModule { }
