import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { PlantaComponent } from './planta.component';
// import { DataTableModule } from 'angular-4-data-table/src/index';
// import { DataTableDemo2 } from './demo2/data-table-demo2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgxIpModule } from 'ngx-ip';
import { ModalModule } from '../../../modal/modal.module';
import { ModalService } from '../../../modal/modal.service';
import { AndaimeModule } from '../../../../../../_andaime/andaime.module';
// import { PreviewFurnitureComponent } from './preview-furniture/preview-furniture.component';
// import { ChairsLayoutComponent } from './chairs-layout/chairs-layout.component';
import { PlantaService } from './planta.service';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { VinculoEspacoFormComponent } from './vinculo-espaco-form/vinculo-espaco-form.component';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: PlantaComponent, children: [
          // { path: 'new', component: TipoFormComponent },
          // { path: ':id', component: TipoFormComponent }
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
    LayoutModule,
    HttpClientModule,
    NgxDatatableModule,
    RouterModule.forChild(routes),
    NgbModule, //ovo,
    NgxIpModule,
    ModalModule,
    AndaimeModule,
    // BrowserModule,
    // BrowserAnimationsModule,
    // SharedModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule.forRoot(),
  ], exports: [
    RouterModule
  ], declarations: [
    PlantaComponent,
    VinculoEspacoFormComponent
    // PreviewFurnitureComponent,
    // ChairsLayoutComponent
  ],
  entryComponents: [
    PlantaComponent,
    VinculoEspacoFormComponent
    // ChairsLayoutComponent
  ],
  providers: [
    ModalService,
    PlantaService
  ]
})
export class PlantaModule { }
