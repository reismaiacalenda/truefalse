import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { DidaticoComponent } from './didatico.component';
import { DidaticoDataTableComponent } from './didatico-data-table/didatico-data-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DidaticoFormComponent } from './didatico-form/didatico-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from '../../../modal/modal.module';
import { ModalService } from '../../../modal/modal.service';
import { AndaimeModule } from '../../../../../../_andaime/andaime.module';
import { ImageUploadModule } from 'angular2-image-upload';
// import { ImageUploadService } from 'angular2-image-upload/lib/image-upload.service';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: DidaticoComponent, children: [
          { path: 'new', component: DidaticoFormComponent },
          { path: ':id', component: DidaticoFormComponent }
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
    ImageUploadModule.forRoot(),
    // ImageUploadService,
    RouterModule.forChild(routes),
    NgbModule, 
    ModalModule,
    AndaimeModule
  ], exports: [
    RouterModule
  ], declarations: [
    DidaticoComponent,
    DidaticoDataTableComponent,
    DidaticoFormComponent,
  ],
  entryComponents: [
    DidaticoFormComponent,
  ],
  providers: [
    ModalService//,
    // ImageUploadService
  ]
})
export class DidaticoModule { }
