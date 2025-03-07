import { HttpClientModule } from '@angular/common/http';
// import { OvoDebugComponent } from './../../ovo/ovo-debug/ovo-debug.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutPortaComponent } from './layout-porta.component';
import { LayoutPortaDataTableComponent } from './layout-porta-data-table/layout-porta-data-table.component';
// import { DataTableModule } from 'angular-4-data-table/src/index';
// import { DataTableDemo2 } from './demo2/data-table-demo2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LayoutPortaFormComponent } from './layout-porta-form/layout-porta-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageUploadModule } from "angular2-image-upload";
import { ColorPickerModule } from 'ngx-color-picker';
import { DefaultComponent } from '../../../default.component';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { ModalModule } from '../../../modal/modal.module';
import { ModalService } from '../../../modal/modal.service';
import { AndaimeModule } from '../../../../../../_andaime/andaime.module';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: LayoutPortaComponent, children: [
          { path: 'new', component: LayoutPortaFormComponent },
          { path: ':id', component: LayoutPortaFormComponent }
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
    NgbModule, //ovo,
    ModalModule,
     ImageUploadModule.forRoot(),
    ColorPickerModule,
    AndaimeModule
  ], exports: [
    RouterModule
  ], declarations: [
    LayoutPortaComponent,
    LayoutPortaDataTableComponent,
    LayoutPortaFormComponent
  ],
  entryComponents: [
    LayoutPortaFormComponent,
  ],
  providers: [
    ModalService
  ]
})
export class LayoutPortaModule { }
