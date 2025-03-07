import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgxIpModule } from 'ngx-ip';
import { ModalModule } from '../../modal/modal.module';
import { ModalService } from '../../modal/modal.service';
import { MyBookingsComponent } from './my-bookings.component';
import { MyBookingsDataTableComponent } from './my-bookings-data-table/my-bookings-data-table.component';
import { AndaimeModule } from '../../../../../_andaime/andaime.module';
import { NgxCollapseModule } from 'ngx-collapse';
import { ReservaModalService } from '../reserva-modal/reserva-modal.service';
import { CheckModalService } from '../checks-modal/check-modal.service';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AgendarDropdownModule } from '../agendar-dropdown/agendar-dropdown.module';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: MyBookingsComponent, children: [
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
    NgxCollapseModule,
    LayoutModule,
    HttpClientModule,
    NgxDatatableModule,
    RouterModule.forChild(routes),
    NgbModule,
    NgxIpModule,
    ModalModule,
    AndaimeModule,
    InlineSVGModule,
    AgendarDropdownModule
  ], exports: [
    RouterModule
  ], declarations: [
    MyBookingsComponent,
    MyBookingsDataTableComponent
  ],
  entryComponents: [
  ],
  providers: [
    ModalService,
    ReservaModalService,
    CheckModalService
  ]
})
export class MyBookingsModule { }
