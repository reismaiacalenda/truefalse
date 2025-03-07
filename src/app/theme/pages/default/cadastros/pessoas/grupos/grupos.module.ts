import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GruposComponent } from './grupos.component';
import { GruposDataTableComponent } from './grupos-data-table/grupos-data-table.component';
// import { DataTableModule } from 'angular-4-data-table/src/index';
// import { DataTableDemo2 } from './demo2/data-table-demo2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { GruposFormComponent } from './grupos-form/grupos-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgxIpModule } from 'ngx-ip';
import { DefaultComponent } from '../../../default.component';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { ModalModule } from '../../../modal/modal.module';
import { AndaimeModule } from '../../../../../../_andaime/andaime.module';
import { ModalService } from '../../../modal/modal.service';
import { NgSelectModule } from '@ng-select/ng-select';
// import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
// import { es } from '@ng-select/ng-select/lib/console.service';
// import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
// import { ConsoleService } from '@ng-select/ng-select/lib/console.service';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: GruposComponent, children: [
          { path: 'new', component: GruposFormComponent },
          { path: ':id', component: GruposFormComponent }
        ]
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    // NgSelectConfig,
    // NgOptionHighlightModule,
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
    GruposComponent,
    GruposDataTableComponent,
    GruposFormComponent,
  ],
  entryComponents: [
    GruposFormComponent,
  ],
  providers: [
    ModalService,
    // NgSelectConfig
    // ConsoleService
    // es
  ]
})
export class GruposModule { }
