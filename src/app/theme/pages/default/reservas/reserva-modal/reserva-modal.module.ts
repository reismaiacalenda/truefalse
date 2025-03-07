import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecursoFormComponent } from './recursos/recursos-form.component';
import { ConvidadoFormComponent } from './convidados/convidados-form.component';
import { ReservaModalAvancadaFormComponent } from './reserva-modal-avançada/reserva-modal-avancada-form.component';
import { ConvidarFormComponent } from './convidar/convidar-form.component';
import { CancelarReservaModalComponent } from './cancelar-reserva-modal/cancelar-reserva-modal.component';
import { EmprestimoFormComponent } from './emprestimo/emprestimo-form.component';
import { EquipagemFormComponent } from './equipagem/equipagem-form.component';
import { ReservaPostoTrabalhoFormComponent } from './reserva-posto-trabalho/reserva-posto-trabalho-form.component';
import { ParametrizacaoFormComponent } from './parametrizacoes/parametrizacao-form.component';
import { InstalarRecursoFormComponent } from './Instalar-recursos/Instalar-recursos-form.component';
import { ReservaModalSimplesFormComponent } from './reserva-modal-simples/reserva-modal-simples-form.component';
import { ReservaModalService } from './reserva-modal.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../../../../layouts/layout.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AndaimeModule } from '../../../../../_andaime/andaime.module';
import { ConfigTelaReservaFormComponent } from './config-tela-reserva/config-tela-reserva-form.component';
import { CamposCustomizadosPreDefinidosComponent } from './campos-customizados-pre-definidos/campos-customizados-pre-definidos.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RecorrenciaFormComponent } from './recorrencia/recorrencia-form.component';
import { PegarEquipamentoComponent } from './acoes/pegar-equipamento/pegar-equipamento.component';
import { MapaModalFormComponent } from '../mapa/mapa-modal/mapa-modal-form.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PessoaPegarEquipamentoComponent } from './acoes/pegar-equipamento/pessoa-pegar-equipamento.component';
import { CheckupCovidFormComponent } from '../../cadastros/checkups/checkup-covid-form/checkup-covid-form.component';
import { VacinadoFormComponent } from '../../cadastros/checkups/vacinado-form/vacinado-form.component';
import { BurnoutFormComponent } from '../../cadastros/checkups/burnout-form/burnout-form.component';
import { ReservaEstacaoFlexivelFormComponent } from './reserva-estacao-flexivel/reserva-estacao-flexivel-form.component';
import { ReservaEstacionamentoFormComponent } from './reserva-estacionamento/reserva-estacionamento-form.component';
import { ReservaFretadoFormComponent } from './reserva-fretado/reserva-fretado-form.component';
import { CheckupsModule } from '../../cadastros/checkups/checkups.module';
import { AgendaDoDiaComponent } from './consultar/agenda-do-dia/agenda-do-dia.component';
import { DetalheReservaComponent } from './consultar/detalhe-reserva/detalhe-reserva.component';
import { TrabalharEscritorioComponent } from './acoes/trabalhar-escritorio/trabalhar-escritorio.component';
import { KitEstandeFormComponent } from './kit-estande/kit-estande-form.component';
import { ModalMaisOpcoesComponent } from "./modal-mais-opcoes/modal-mais-opcoes.component";
import { MapaModule } from '../mapa/mapa.module';
import { SelecionarMapaQuadrosComponent } from './acoes/mapa-smartrooms/selecionar-mapa-quadros.component';

// RouterModule.forChild(routes),
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    LayoutModule,
    // RouterModule.forChild(routes),
    HttpClientModule,
    AndaimeModule,
    ReactiveFormsModule,
    NgSelectModule,
    InlineSVGModule.forRoot(),
    CheckupsModule,
  ],
  exports: [

  ],
  declarations: [
    InstalarRecursoFormComponent,
    RecursoFormComponent,
    ConvidadoFormComponent,
    ReservaModalSimplesFormComponent,
    ReservaModalAvancadaFormComponent,
    ConvidarFormComponent,
    ConfigTelaReservaFormComponent,
    ParametrizacaoFormComponent,
    CamposCustomizadosPreDefinidosComponent,
    ReservaPostoTrabalhoFormComponent,
    ReservaEstacaoFlexivelFormComponent,
    ReservaEstacionamentoFormComponent,
    ReservaFretadoFormComponent,
    EquipagemFormComponent,
    EmprestimoFormComponent,
    KitEstandeFormComponent,
    ModalMaisOpcoesComponent,
    RecorrenciaFormComponent,
    CancelarReservaModalComponent,
    PegarEquipamentoComponent,
    SelecionarMapaQuadrosComponent,
    PessoaPegarEquipamentoComponent,
    AgendaDoDiaComponent,
    DetalheReservaComponent,
    TrabalharEscritorioComponent
  ],
  providers: [
    ReservaModalService
  ],
  entryComponents: [
    InstalarRecursoFormComponent,
    RecursoFormComponent,
    ConvidadoFormComponent,
    ReservaModalSimplesFormComponent,
    ReservaModalAvancadaFormComponent,
    ConvidarFormComponent,
    ConfigTelaReservaFormComponent,
    ParametrizacaoFormComponent,
    CamposCustomizadosPreDefinidosComponent,
    ReservaPostoTrabalhoFormComponent,
    ReservaEstacaoFlexivelFormComponent,
    ReservaEstacionamentoFormComponent,
    ReservaFretadoFormComponent,
    EquipagemFormComponent,
    EmprestimoFormComponent,
    KitEstandeFormComponent,
    ModalMaisOpcoesComponent,
    RecorrenciaFormComponent,
    CancelarReservaModalComponent,
    PegarEquipamentoComponent,
    SelecionarMapaQuadrosComponent,
    PessoaPegarEquipamentoComponent,
    AgendaDoDiaComponent,
    DetalheReservaComponent,
    TrabalharEscritorioComponent
  ]
})
export class ReservaModalModule { }






















// import { HttpClientModule } from '@angular/common/http';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Routes, RouterModule } from '@angular/router';
// import { LayoutModule } from '../../../../layouts/layout.module';
// import { DefaultComponent } from './../../default.component';
// import { ModalService } from '../../modal/modal.service';
// import { AndaimeModule } from './../../../../../_andaime/andaime.module';
// import { NgxCollapseModule } from 'ngx-collapse';
// import { TooltipModule } from 'ng2-tooltip-directive';
// import { QuadroComponent } from '../quadro/quadro.component';
// import { CardComponent } from '../quadro/card/card.component';
// import { QuadroFormRecursosComponent } from '../quadro/quadro-form-recursos/quadro-form-recursos.component';
// import { TfDropdownComponent } from '../quadro/dropdown/tf-dropdown.component';
// import { ReservaDetalhesComponent } from '../config-tela-reserva/config-reserva-detalhes/reserva-detalhes.component';
// import { RecursoFormComponent } from './recursos/recursos-form.component';
// import { ConvidadoFormComponent } from './convidados/convidados-form.component';
// import { ReservaModalSimplesFormComponent } from './reserva-modal-simples/reserva-modal-simples-form.component';
// import { ReservaModalAvancadaFormComponent } from './reserva-modal-avançada/reserva-modal-avancada-form.component';

// const routes: Routes = [
//   {
//     "path": "",
//     "component": DefaultComponent,
//     "children": [
//       { path: 'simples', component: ReservaModalSimplesFormComponent },
//       { path: 'avancada', component: ReservaModalAvancadaFormComponent }
//     ]
//   }
// ];

// @NgModule({
//   imports: [
//     CommonModule,
//     FormsModule,
//     LayoutModule,
//     RouterModule.forChild(routes),
//     AndaimeModule,
//     ReactiveFormsModule,
//     FormsModule
//   ],
//   declarations: [
//     RecursoFormComponent,
//     ConvidadoFormComponent,
//     ReservaModalSimplesFormComponent,
//     ReservaModalAvancadaFormComponent
//   ],
//   entryComponents: [
//     RecursoFormComponent,
//     ConvidadoFormComponent,
//     ReservaModalSimplesFormComponent,
//     ReservaModalAvancadaFormComponent
//   ],
//   providers: [
//     ModalService
//   ],
//   exports: [
//     RecursoFormComponent,
//     ConvidadoFormComponent,
//     ReservaModalSimplesFormComponent,
//     ReservaModalAvancadaFormComponent,
//     RouterModule
//   ]
// })
// export class ReservaModalModule { }