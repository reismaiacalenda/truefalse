import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { ClientApiComponent } from './client-api.component';
import { ClientApiDataTableComponent } from './client-api-data-table/client-api-data-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ClientApiFormComponent } from './client-api-form/client-api-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from '../../../modal/modal.module';
import { ModalService } from '../../../modal/modal.service';
import { AndaimeModule } from '../../../../../../_andaime/andaime.module';
import { ImageUploadModule } from 'angular2-image-upload';
import { PipePipe } from './pipe.pipe';
// import { ImageUploadService } from 'angular2-image-upload/lib/image-upload.service';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: ClientApiComponent, children: [
          { path: 'new', component: ClientApiFormComponent },
          { path: ':id', component: ClientApiFormComponent }
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
    ClientApiComponent,
    ClientApiDataTableComponent,
    ClientApiFormComponent,
    PipePipe,
  ],
  entryComponents: [
    ClientApiFormComponent,
  ],
  providers: [
    ModalService//,
    // ImageUploadService
  ]
})
export class ClientApiModule { }
