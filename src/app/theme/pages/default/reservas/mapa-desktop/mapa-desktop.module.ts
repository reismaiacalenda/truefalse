import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
// import { DataTableModule } from 'angular-4-data-table/src/index';
// import { DataTableDemo2 } from './demo2/data-table-demo2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgxIpModule } from 'ngx-ip';
import { ModalModule } from '../../modal/modal.module';
import { ModalService } from '../../modal/modal.service';
import { AndaimeModule } from '../../../../../_andaime/andaime.module';
// import { PreviewFurnitureComponent } from './preview-furniture/preview-furniture.component';
// import { ChairsLayoutComponent } from './chairs-layout/chairs-layout.component';
// import { PlantaService } from './planta.service';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FiltrosVisualizacaoModule } from '../filtros-visualizacao/filtros-visualizacao.module';
import { ModalSelecionarLocalizacaoComponent } from './modal-selecionar-localizacao/modal-selecionar-localizacao.component';
import { ModalSelecionarHorarioComponent } from './modal-selecionar-horario/modal-selecionar-horario.component';
import { ModalSelecionarDataComponent } from './modal-selecionar-data/modal-selecionar-data.component';
import { MiniCalendarPickerComponent } from './modal-selecionar-data/mini-calendar-picker/mini-calendar-picker.component';
import { RodapeReservarComponent } from './rodape-reservar/rodape-reservar.component';
import { RodapeDetalheReservaComponent } from './rodape-detalhe-reserva/rodape-detalhe-reserva.component';
import { RodapeEspacoBloqueadoComponent } from './rodape-espaco-bloqueado/rodape-espaco-bloqueado.component';
import { MapaModalFormComponent } from './mapa-modal/mapa-modal-form.component';
import { ModalSalaReservadaComponent } from './modal-reservar-sala/modal-sala-reservada.component';
import { ModalContinuacaoReservaComponent } from './modal-continuacao-reserva/modal-continuacao-reserva.component';
import { ModalTermoComponent } from './modal-termo/modal-termo.component';
import { MapaDesktopComponent } from './mapa-desktop.component';
import { ModalLoadingMapaComponent } from './modal-loading-mapa/modal-loading-mapa.component';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        path: '', component: MapaDesktopComponent, children: [
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
    FiltrosVisualizacaoModule,
    // ModalTermo
  ], exports: [
    // RouterModule,
  ], declarations: [
    MapaDesktopComponent,
    ModalSelecionarLocalizacaoComponent,
    ModalSelecionarHorarioComponent,
    ModalSelecionarDataComponent,
    MiniCalendarPickerComponent,
    RodapeReservarComponent,
    RodapeDetalheReservaComponent,
    RodapeEspacoBloqueadoComponent,
    MapaModalFormComponent,
    ModalSalaReservadaComponent,
    ModalContinuacaoReservaComponent,
    ModalTermoComponent,
    ModalLoadingMapaComponent
    // PreviewFurnitureComponent,
    // ChairsLayoutComponent
  ],
  entryComponents: [
    MapaDesktopComponent,
    ModalSelecionarLocalizacaoComponent,
    ModalSelecionarHorarioComponent,
    ModalSelecionarDataComponent,
    MiniCalendarPickerComponent,
    RodapeReservarComponent,
    RodapeDetalheReservaComponent,
    RodapeEspacoBloqueadoComponent,
    MapaModalFormComponent,
    ModalSalaReservadaComponent,
    ModalContinuacaoReservaComponent,
    ModalTermoComponent,
    ModalLoadingMapaComponent
    // ChairsLayoutComponent
  ],
  providers: [
    ModalService,
    // PlantaService
  ]
})
export class MapaDesktopModule { }
