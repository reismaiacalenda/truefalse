import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { QuadroComponent } from './quadro-espacos.component';
import { CardComponent } from './card/card.component';
import { ModalService } from '../../../modal/modal.service';
import { AndaimeModule } from '../../../../../../_andaime/andaime.module';
import { NgxCollapseModule } from 'ngx-collapse';
import { TfDropdownComponent } from '../../filtros-visualizacao/dropdown/tf-dropdown.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ReservaModalModule } from '../../reserva-modal/reserva-modal.module';
import { ReservaModalService } from '../../reserva-modal/reserva-modal.service';
import { CheckModalService } from '../../checks-modal/check-modal.service';
import { CheckModalModule } from '../../checks-modal/check-modal.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CollapseBarComponent } from './collapse-bar/collapse-bar.component';
import { FiltrosVisualizacaoModule } from '../../filtros-visualizacao/filtros-visualizacao.module';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": QuadroComponent,
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
    NgbModule,
    InlineSVGModule,
    FiltrosVisualizacaoModule
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    QuadroComponent,
    CardComponent,
    CollapseBarComponent
  ],
  entryComponents: [
  ],
  providers: [
    ModalService,
    ReservaModalService,
    CheckModalService
  ]
})
export class QuadroEspacoModule { }