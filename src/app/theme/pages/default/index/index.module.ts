import { LayoutModule } from './../../../layouts/layout.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index.component';
import { DefaultComponent } from '../default.component';
import { ModalService } from '../modal/modal.service';
import { ModalModule } from '../modal/modal.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { JornalComponent } from './jornal/jornal.component';
import { QrcalendaComponent } from './qrcalenda/qrcalenda.component';
import { TrialComponent } from './trial/trial.component';
import { GastosComponent } from './gastos/gastos.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShepherdService } from 'angular-shepherd';
import { AcoesComponent } from './acoes/acoes.component';
import { EquipeComponent } from './equipe/equipe.component';
import { EngajamentoComponent } from './engajamento/engajamento.component';
import { AndaimeModule } from '../../../../_andaime/andaime.module';
import { NgSelect2Module } from 'ng-select2';
import { ReactiveFormsModule } from '@angular/forms';
import { SymbolPessoaComponent } from './equipe/symbol-pessoa/symbol-pessoa.component';
import { NPSComponent } from './nps/nps.component';
import { AgendarDropdownModule } from '../reservas/agendar-dropdown/agendar-dropdown.module';
import { OfficePassComponent } from './office-pass/office-pass.component';
import { MiniCalendarIndexComponent } from './mini-calendar-index/mini-calendar-index.component';
import { CitacaoComponent } from './citacao/citacao.component';
import { JornalSmartroomComponent } from './jornal-smartroom/jornal-smartroom.component';
import { JornalServicosRecursosComponent } from './jornal-servicos-recursos/jornal-servicos-recursos.component';
import { JornalHotdeskComponent } from './jornal-hotdesk/jornal-hotdesk.component';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": IndexComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LayoutModule,
    ModalModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    AndaimeModule,
    NgSelect2Module,
    ReactiveFormsModule,
    AgendarDropdownModule
  ], exports: [
    RouterModule,
  ], declarations: [
    IndexComponent,
    JornalComponent,
    JornalSmartroomComponent,
    JornalServicosRecursosComponent,
    JornalHotdeskComponent,
    OfficePassComponent,
    QrcalendaComponent,
    TrialComponent,
    GastosComponent,
    AcoesComponent,
    EquipeComponent,
    EngajamentoComponent,
    NPSComponent,
    SymbolPessoaComponent,
    MiniCalendarIndexComponent,
    CitacaoComponent
  ],providers: [
    ModalService,
    ShepherdService
  ],schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class IndexModule {



}
