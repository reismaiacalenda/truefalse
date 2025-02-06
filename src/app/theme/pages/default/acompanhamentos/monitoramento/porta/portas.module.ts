import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { PortasComponent } from './portas.component';
import { CardComponent } from './card/card.component';
import { ModalService } from '../../../modal/modal.service';
import { AndaimeModule } from '../../../../../../_andaime/andaime.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PortasFormComponent } from './portas-form/portas-form.component';
import { NgxCollapseModule } from 'ngx-collapse';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": PortasComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LayoutModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    AndaimeModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgxCollapseModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    PortasComponent,
    CardComponent,
    PortasFormComponent
  ],
  entryComponents: [
    PortasFormComponent
  ],
  providers: [
    ModalService
  ]
})
export class PortasModule { }