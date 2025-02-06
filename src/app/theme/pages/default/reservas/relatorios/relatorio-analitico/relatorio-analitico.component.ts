import { AfterViewInit } from '@angular/core';
// import { RequestOptions } from '@angular/http';
// import { HttpRequest, HttpHeaders  } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { DomainService } from '../../../../../../_services/domain.service';
import { ModalService } from '../../../modal/modal.service';
import { DOCUMENT } from "@angular/common";
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebService } from '../../../../../../_services/web.service';
import { consoleLog } from '../../../../../../globals';

// declare function bindRelatorios(): any;
// declare function closeRelatorios(): any;?
declare function setarReservasPorMes(dados): any;
declare function setarReservasPorFuncionario(dados): any;
declare function setarReservasPorDuracao(dados): any;

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./relatorio-analitico.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class RelatorioAnaliticoComponent implements OnInit, OnDestroy, AfterViewInit {
  relatorios: any[];
  apiUrl: string;
  percents: any[];
  totalReservas: string;
  maisLonga: string;
  maisCurta: string;
  canceladas: string;
  mediaPonderada: string;

  constructor(private http: HttpClient,
    private domainService: DomainService,
    private modalService: ModalService,
    private webService: WebService,
    private _script: ScriptLoaderService,
    @Inject(DOCUMENT) private document: any
    // private zone:NgZone
  ) {
    // window['angularComponentRef'] = {
    //   zone: this.zRequestOptionsone,
    //   componentFn: (value) => this.exibirLog(value),
    //   component: this
    // }
    // this._script.load('body',
    // 'assets/app/js/dataRelatorios.js');
    this._script.load('body',
          'assets/app/js/relatorios_variaveis.js');
  }
  
  ngOnInit() {
    // bindRelatorios();
    this.carregarRelatorios();
  }
  
  ngAfterViewInit(){
    // this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
    //   'assets/vendors/custom/flot/flot.bundle.js')
    // this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
    //   'assets/demo/default/custom/components/charts/flotcharts.js');
  }

  carregarRelatorios(reload = false) {
    Helpers.setLoading(true);

    this.webService.get(`relatorios/reservas/reservasPorFuncionario`)
      .subscribe((dados:any) => {
        setarReservasPorFuncionario(dados)
      },
      (error: any) => this.modalService.tratarError(error)
      )

    this.webService.get(`relatorios/reservas/reservasPorDuracao.json`)
      .subscribe((dados:any) => {
        setarReservasPorDuracao(dados)
        this.percents = dados.percents;
        this.totalReservas =  dados.totalReservas;
        this.maisLonga = dados.maisLonga;
        this.maisCurta = dados.maisCurta;
        this.canceladas = dados.canceladas;
        this.mediaPonderada = dados.mediaPonderada;
      },
      (error: any) => this.modalService.tratarError(error)
    )

    this.webService.get(`relatorios/reservas/reservasPorMes.json`)
      .subscribe((dados:any) => {
        setarReservasPorMes(dados)
      },
      (error: any) => this.modalService.tratarError(error)
      ).add(() => {
        if (!reload){
          this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
          'assets/app/js/relatorios.js');
        }
        Helpers.setLoading(false);
      })
  }

  // exibirLog(value){
  //   Helpers.setLoading(false);
  //   consoleLog('calledFromOutseide' + value);
  //   this.modalService.tratarTree(value);
  // }

  ngOnDestroy() {
    // closeRelatorios();
    // window['angularComponent'] = null;
  }

}
