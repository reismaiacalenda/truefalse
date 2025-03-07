import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TooltipModule } from 'ng2-tooltip-directive';
import { NgxCollapseModule } from 'ngx-collapse';
import { LayoutModule } from '../../../../../theme/layouts/layout.module';
import { AndaimeModule } from '../../../../../_andaime/andaime.module';
import { DefaultComponent } from '../../default.component';
import { ModalService } from '../../modal/modal.service';
import { CheckModalModule } from '../checks-modal/check-modal.module';
import { CheckModalService } from '../checks-modal/check-modal.service';
import { TfDropdownComponent } from './dropdown/tf-dropdown.component';
import { QuadroComponent } from '../quadros/quadro-espacos/quadro-espacos.component';
import { ReservaModalModule } from '../reserva-modal/reserva-modal.module';
import { ReservaModalService } from '../reserva-modal/reserva-modal.service';
import { QuadroFormAmenitiesComponent } from './quadro-form-amenities/quadro-form-amenities.component';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        // "path": "",
        // "component": QuadroComponent,
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
    // RouterModule.forChild(routes),
    HttpClientModule,
    AndaimeModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCollapseModule,
    TooltipModule,
    ReservaModalModule,
    CheckModalModule,
    NgbModule,
    InlineSVGModule
  ],
  exports: [
    // RouterModule,
    QuadroFormAmenitiesComponent,
    TfDropdownComponent
  ],
  declarations: [
    QuadroFormAmenitiesComponent,
    TfDropdownComponent
  ],
  entryComponents: [
    QuadroFormAmenitiesComponent,
    TfDropdownComponent
  ],
  providers: [
    // ModalService,
    // ReservaModalService,
    // CheckModalService
  ]
})
export class FiltrosVisualizacaoModule { }