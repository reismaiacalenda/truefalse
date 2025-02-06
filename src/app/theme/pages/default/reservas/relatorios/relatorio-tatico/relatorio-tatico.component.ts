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
import { ActivatedRoute, Router } from '@angular/router';

declare function setarOcupacao(data): any;
declare function setarFrequencia(data): any;
declare function setarSituacao(data): any;

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./relatorio-tatico.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class RelatorioTaticoComponent implements OnInit, OnDestroy, AfterViewInit {
  apiUrl: string;
  frequenciaTotal;
  situacao: any = {
    ocupado: 0,
    ocupadoRelativo: "0%",
    espera: 0,
    esperaRelativo: "0%",
    livre: 0,
    livreRelativo: "0%",
    total: 0
  };

  constructor(private http: HttpClient,
    private domainService: DomainService,
    private modalService: ModalService,
    private webService: WebService,
    private _script: ScriptLoaderService,
    private _route: ActivatedRoute,
    private _router: Router
    // private zone:NgZone
  ) {
    // window['angularComponentRef'] = {
    //   zone: this.zRequestOptionsone,
    //   componentFn: (value) => this.exibirLog(value),
    //   component: this
    // }
    // this._script.load('body',
    // 'assets/app/js/dataRelatorios.js');
    // this._script.load('body',
          // 'assets/app/js/relatorios_variaveis.js');
    this.apiUrl = `${this.domainService.getApiUrl()}/relatorios`;
    this._script.load('body',
      'assets/app/js/data.js');
  }
  
  ngOnInit() {
    // bindRelatorios();

    // consoleLog("repassou aqui");
    // var bool = (this._route.snapshot.queryParams["reload"] || "false") == "true";
    // consoleLog(bool);
    // if (bool){
    //   consoleLog("reloaded?")
    //   var reloaded = localStorage.getItem("reloaded");
    //   consoleLog(reloaded);
    //   if (reloaded == undefined || reloaded == "false"){
    //     localStorage.setItem("reloaded", "true");
    //     // window.location.reload(true);
    //   }
    // }

    Helpers.setLoading(true);
    this.carregarRelatorios();
  }
  
  ngAfterViewInit(){
    // this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
    //   'assets/vendors/custom/flot/flot.bundle.js')
    // this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
    //   'assets/demo/default/custom/components/charts/flotcharts.js');
  }

  carregarRelatorios(reload = false) {
    this.webService.get(`relatorios/espacos/ocupacao`)
      .subscribe(dados => {
        setarOcupacao(dados);
      },
        (error) => this.modalService.tratarError(error)
      ).add(() => {
        Helpers.setLoading(false);
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
          'assets/app/js/dashboard.js');
      })

    this.webService.get(`relatorios/espacos/situacao`)
      .subscribe(dados => {
        this.situacao = dados;
        setarSituacao(this.situacao)
      },
      (error: any) => this.modalService.tratarError(error)
      ).add(() => {
        Helpers.setLoading(false);
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
          'assets/app/js/dashboard.js');
      })

    this.webService.get(`relatorios/reservas/frequenciaHorarioSintetico`)
      .subscribe(dados => {
        this.frequenciaTotal = (<any>dados).total;
        setarFrequencia(dados)
      },
      (error: any) => this.modalService.tratarError(error)
      ).add(() => {
        Helpers.setLoading(false);
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
          'assets/app/js/dashboard.js');
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
