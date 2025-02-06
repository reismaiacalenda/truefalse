import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { AssinaturaComponent } from './assinatura.component';
import { AssinaturaDataTableComponent } from './assinatura-data-table/assinatura-data-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AssinaturaFormComponent } from './assinatura-form/assinatura-form.component';
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
        path: '', component: AssinaturaComponent, children: [
          { path: 'new', component: AssinaturaFormComponent },
          { path: ':id', component: AssinaturaFormComponent }
        ]
      }
    ]
  }
];

//acrescentei módulo legal pro assinatura

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
    AssinaturaComponent,
    AssinaturaDataTableComponent,
    AssinaturaFormComponent,
  ],
  entryComponents: [
    AssinaturaFormComponent,
  ],
  providers: [
    ModalService
  ]
})
export class AssinaturaModule { }
