import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { RecursoComponent } from './quadro-recursos.component';
import { CardComponent } from './card/card.component';
import { ModalService } from '../../../modal/modal.service';
import { AndaimeModule } from '../../../../../../_andaime/andaime.module';
import { NgxCollapseModule } from 'ngx-collapse';
import { RecursoFormRecursosComponent } from './recurso-form-recursos/recurso-form-recursos.component';
import { TfDropdownComponent } from './dropdown/tf-dropdown.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ReservaModalModule } from '../../reserva-modal/reserva-modal.module';
import { ReservaModalService } from '../../reserva-modal/reserva-modal.service';
import { CheckModalService } from '../../checks-modal/check-modal.service';
import { CheckModalModule } from '../../checks-modal/check-modal.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CollapseBarComponent } from './collapse-bar/collapse-bar.component';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": RecursoComponent,
        // "children": [
        //   { path: 'simples', component: ReservaModalSimplesFormComponent },
        //   { path: 'avancada', component: ReservaModalAvancadaFormComponent }
        // ]
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
    NgxCollapseModule,
    TooltipModule,
    ReservaModalModule,
    CheckModalModule,
    InlineSVGModule,
    NgbModule
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    RecursoComponent,
    CardComponent,
    CollapseBarComponent,
    RecursoFormRecursosComponent,
    TfDropdownComponent
  ],
  entryComponents: [
    RecursoFormRecursosComponent,
    TfDropdownComponent
  ],
  providers: [
    ModalService,
    ReservaModalService,
    CheckModalService
  ]
})
export class QuadroRecursoModule { }