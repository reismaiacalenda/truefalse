import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { RecursosAlocadosDataTableComponent } from './recursos-alocados-data-table/recursos-alocados-data-table.component';
// import { RecursosAlocadosComponent } from './recursos-alocados.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AgendadorComponent } from './agendador.component';
import { LayoutModule } from '../theme/layouts/layout.module';
import { DefaultComponent } from '../theme/pages/default/default.component';
import { ModalModule } from '../theme/pages/default/modal/modal.module';
import { AndaimeModule } from '../_andaime/andaime.module';
import { ContactFormComponent } from './contact-form/contact-form.component';

const routes: Routes = [
  {
    "path": ":id",
    "component": AgendadorComponent,
    // "children": [
    //   {
    //     path: ':id', component: AgendadorComponent
    // //     // children: [
    // //     //   // { path: 'new', component: RecursosAlocadosFormComponent },
    // //     //   { path: ':id', component: AgendadorComponent }
    // //     // ]
    //   }
    // ]
  }
];


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        // Ng2AutoCompleteModule,
        ReactiveFormsModule,
        LayoutModule,
        // NgxDatatableModule,
        RouterModule.forChild(routes),
        NgbModule,
        // NgxIpModule,
        ModalModule,
        AndaimeModule,
        InlineSVGModule,
        AgendadorComponent,
        ContactFormComponent
    ], exports: [
        RouterModule
    ],
    // entryComponents: [
    //     ContactFormComponent
    // ],
    providers: [
    // ModalService,
    // CheckModalService
    ]
})
export class AgendadorModule { }
