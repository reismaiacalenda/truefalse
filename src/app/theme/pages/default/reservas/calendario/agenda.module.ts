import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '../../modal/modal.service';
import { FullCalendarModule } from 'ng-fullcalendar';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { AgendaComponent } from './agenda.component';
import { ModalModule } from '../../modal/modal.module';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgSelect2Module } from 'ng-select2';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { AndaimeModule } from '../../../../../_andaime/andaime.module';
import { ReservaModalService } from '../reserva-modal/reserva-modal.service';
import { MiniCalendarComponent } from './mini-calendar/mini-calendar.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AdicionarCalendarioPessoaComponent } from './adicionar-calendario-pessoa/adicionar-calendario-pessoa.component';
import { NgxCollapseModule } from 'ngx-collapse';
import { TooltipModule } from 'ng2-tooltip-directive';
import { SelecaoAgendasComponent } from './selecao-agendas/selecao-agendas.component';
import { AdicionarCalendarioSalaComponent } from './adicionar-calendario-sala/adicionar-calendario-sala.component';
import { AdicionarCalendarioMesaComponent } from './adicionar-calendario-mesa/adicionar-calendario-mesa.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgendarDropdownModule } from '../agendar-dropdown/agendar-dropdown.module';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "/:id",
        "component": AgendaComponent
      },
      {
        "path": "",
        "component": AgendaComponent,
        children: [
          // { path: 'new', component: AgendaFormComponent },
          // { path: ':id', component: AgendaComponent }
        ]
      },
      {
        "path": "",
        "component": MiniCalendarComponent
      }
    ]
  }
];

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LayoutModule,
    FullCalendarModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2AutoCompleteModule,
    NgSelect2Module,
    NgxMaskModule.forRoot(options),
    InlineSVGModule.forRoot(),
    AndaimeModule,
    NgxCollapseModule,
    TooltipModule,
    NgbModule,
    AgendarDropdownModule
  ],exports: [
    RouterModule,
    MiniCalendarComponent,
    SelecaoAgendasComponent
  ],declarations: [
    AgendaComponent,
    MiniCalendarComponent,
    SelecaoAgendasComponent,
    AdicionarCalendarioPessoaComponent,
    AdicionarCalendarioSalaComponent,
    AdicionarCalendarioMesaComponent,
  ],entryComponents:[
    AdicionarCalendarioPessoaComponent,
    AdicionarCalendarioSalaComponent,
    AdicionarCalendarioMesaComponent,
  ],providers: [
    ModalService,
    ReservaModalService
  ]})

export class AgendaModule  {

}