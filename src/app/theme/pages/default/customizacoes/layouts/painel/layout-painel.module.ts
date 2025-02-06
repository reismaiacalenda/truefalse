import { HttpClientModule } from '@angular/common/http';
// import { OvoDebugComponent } from './../../ovo/ovo-debug/ovo-debug.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';

// import { DataTableModule } from 'angular-4-data-table/src/index';
// import { DataTableDemo2 } from './demo2/data-table-demo2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageUploadModule } from "angular2-image-upload";
import { ColorPickerModule } from 'ngx-color-picker';
import { DefaultComponent } from '../../../default.component';
import { LayoutPainelComponent } from './layout-painel.component';
import { LayoutPainelFormComponent } from './layout-painel-form/layout-painel-form.component';
import { ModalModule } from '../../../modal/modal.module';
import { LayoutPainelDataTableComponent } from './layout-painel-data-table/layout-painel-data-table.component';
import { ModalService } from '../../../modal/modal.service';
import { AndaimeModule } from '../../../../../../_andaime/andaime.module';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: LayoutPainelComponent, children: [
          { path: 'new', component: LayoutPainelFormComponent },
          { path: ':id', component: LayoutPainelFormComponent }
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
    LayoutPainelComponent,
    LayoutPainelDataTableComponent,
    LayoutPainelFormComponent
  ],
  entryComponents: [
    LayoutPainelFormComponent,
  ],
  providers: [
    ModalService
  ]
})
export class LayoutPainelModule { }
