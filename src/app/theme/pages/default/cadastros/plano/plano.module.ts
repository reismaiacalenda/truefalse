import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { PlanoComponent } from './plano.component';
import { PlanoDataTableComponent } from './plano-data-table/plano-data-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PlanoFormComponent } from './plano-form/plano-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from '../../modal/modal.module';
import { ModalService } from '../../modal/modal.service';
import { AndaimeModule } from '../../../../../_andaime/andaime.module';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: PlanoComponent, children: [
          { path: 'new', component: PlanoFormComponent },
          { path: ':id', component: PlanoFormComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    HttpClientModule,
    NgxDatatableModule,
    RouterModule.forChild(routes),
    NgbModule, 
    ModalModule,
    AndaimeModule
  ], exports: [
    RouterModule
  ], declarations: [
    PlanoComponent,
    PlanoDataTableComponent,
    PlanoFormComponent,
  ],
  entryComponents: [
    PlanoFormComponent,
  ],
  providers: [
    ModalService
  ]
})
export class PlanoModule { }
