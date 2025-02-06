import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { FaturaComponent } from './fatura.component';
import { FaturaDataTableComponent } from './fatura-data-table/fatura-data-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FaturaFormComponent } from './fatura-form/fatura-form.component';
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
        path: '', component: FaturaComponent, children: [
          { path: 'new', component: FaturaFormComponent },
          { path: ':id', component: FaturaFormComponent }
        ]
      }
    ]
  }
];

//acrescentei módulo legal pro fatura

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
    FaturaComponent,
    FaturaDataTableComponent,
    FaturaFormComponent,
  ],
  entryComponents: [
    FaturaFormComponent,
  ],
  providers: [
    ModalService
  ]
})
export class FaturaModule { }
