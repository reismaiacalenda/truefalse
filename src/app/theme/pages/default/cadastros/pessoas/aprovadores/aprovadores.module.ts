import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, NgSelectOption } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AprovadoresComponent } from './aprovadores.component';
import { AprovadoresDataTableComponent } from './aprovadores-data-table/aprovadores-data-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AprovadoresFormComponent } from './aprovadores-form/aprovadores-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgxIpModule } from 'ngx-ip';
import { DefaultComponent } from '../../../default.component';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { ModalModule } from '../../../modal/modal.module';
import { AndaimeModule } from '../../../../../../_andaime/andaime.module';
import { ModalService } from '../../../modal/modal.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { InlineSVGModule } from 'ng-inline-svg-2';
// import { DataTableModule } from 'angular-4-data-table/src/index';
// import { DataTableDemo2 } from './demo2/data-table-demo2';
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
        path: '', component: AprovadoresComponent, children: [
          { path: 'new', component: AprovadoresFormComponent },
          { path: ':id', component: AprovadoresFormComponent }
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
    AndaimeModule,
    InlineSVGModule.forRoot(),
  ], exports: [
    RouterModule
  ], declarations: [
    AprovadoresComponent,
    AprovadoresDataTableComponent,
    AprovadoresFormComponent,
  ],
  entryComponents: [
    AprovadoresFormComponent,
  ],
  providers: [
    ModalService,
    // NgSelectConfig
    // ConsoleService
    // es
  ]
})
export class AprovadoresModule { }
