import { WebService } from '../../../../../../../_services/web.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Helpers } from '../../../../../../../helpers';
import { ModalService } from '../../../../modal/modal.service';
import { DomainService } from '../../../../../../../_services/domain.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PortasFormComponent } from '../portas-form/portas-form.component';
import { consoleLog } from '../../../../../../../globals';
import { WorkspaceService } from '../../../../../../../_services/workspace.service';

declare function redirecionarPorta(data): any;

@Component({
  moduleId: module.id,
  templateUrl: "./card.component.html",
  selector: "card",
})

export class CardComponent implements OnInit, OnChanges {
  @Input() p: any;
  @Output() refreshPortas = new EventEmitter();
  apiUrl: string;

  constructor(private modalNgb: NgbModal,
    private modalService: ModalService,
    public webService: WebService,
    private domainService: DomainService,
    public workspaceService: WorkspaceService,
    private http: HttpClient) {
  }

  ngOnInit() {
    this.apiUrl = `${this.domainService.getApiUrl()}/ssh/${this.p.id}/`;
  }

  ngOnChanges() {
  }

  onAtualizarDados() {
    redirecionarPorta({
      action: "atualizarDados",
      display: this.p.id
    });
  }

// ÍCONE 1 - RECARREGAR PÁGINA
  openFormModalRecarregarPagina(rowId?: string) {
    const modalMessage = this.modalService.tratarMensagem("Recarregar página", "Página do display atualizada.");
    this.onRecarregarPagina();
  }
  onRecarregarPagina() {
    redirecionarPorta({
      action: "recarregar_pagina",
      display: this.p.id
    });
  }

// ÍCONE 2 - ABRIR/FECHAR ESPAÇO
  openFormModalAbrirFecharEspaco(){
    if (this.p.status!="Desconectado"){
    Helpers.setLoading(true);
    consoleLog("Entrou no openFormModalAbrirFecharEspaco")
    this.webService.put(`displays/${this.p.id}/abrir_fechar_espaco`, {})
      .subscribe(
        response =>{
          consoleLog("Entrou no response")
          consoleLog(response)
          Helpers.setLoading(false);
          this.modalService.tratarMensagem("Abrir/fechar espaco", response.body.message)
        },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
    }
  }

// ÍCONE 3 - INFO DISPLAY
  onConferirLog() {
    if (this.p.status=='x'){return;}
    Helpers.setLoading(true);
    redirecionarPorta({
      action: "conferirLog",
      display: this.p.chave_vinculo_licenca
    });
    this.modalService.tratarTree("Conferir Log");
    Helpers.setLoading(false);
  }
  onCheckInfo() {
    if(this.p.ip==''){return;}
    Helpers.setLoading(true);
    this.webService.get(`displays/${this.p.id}/info_display`)
      .subscribe(dados => {
        consoleLog(dados)
        var tree =[{
            text: dados.display.link,
            icon : "fa fa-link"
          },
          {
            text: "Pressione ALT em seu teclado enquanto utiliza o mouse para selecionar o link acima.",
            icon : "fa fa-copy"
          },
          {
            text: "Display",
            icon : "jstree-icon jstree-themeicon fa fa-folder m--font-brand jstree-themeicon-custom",
            children:
          [{
              text: dados.display.nome,
              icon: "fa fa-file-o"
          },{
              text: dados.display.ip,
              icon: "fa fa-terminal"
          },{
              text: dados.display.tipo_rede,
              icon: "fa fa-wifi"
          },{
              text: dados.display.chave_vinculo_licenca,
              icon: "fa fa-key"
          },{
              text: dados.display.vinculo,
              icon: "fa fa-link"
          }]
          },
          {
            text: "Desempenho",
            icon : "jstree-icon jstree-themeicon fa fa-folder m--font-brand jstree-themeicon-custom",
            children:
          [{
              text: dados.desempenho.temperatura,
              icon: "fa fa-thermometer-half"
          },{
              text: dados.desempenho.cpu,
              icon: "fa fa-microchip"
          },{
              text: dados.desempenho.memoria,
              icon: "fa fa-microchip"
          },{
              text: dados.desempenho.disco,
              icon: "fa fa-hdd-o"
          },{
              text: dados.desempenho.uptime,
              icon: "fa fa-clock-o"
          }]
          },
          {
            text: "Componentes",
            icon : "jstree-icon jstree-themeicon fa fa-folder m--font-brand jstree-themeicon-custom",
            children:
            [{
              text: "Raspberry",
              icon : "jstree-icon jstree-themeicon fa fa-folder m--font-brand jstree-themeicon-custom",
              children:
            [{
                text: dados.componentes.raspberry.serie,
                icon: "fa fa-barcode"
            },{
                text: dados.componentes.raspberry.entrada,
                icon: "fa fa-calendar"
            }]
            },{
              text: "SD",
              icon : "jstree-icon jstree-themeicon fa fa-folder m--font-brand jstree-themeicon-custom",
              children:
            [{
                text: dados.componentes.sd.serie,
                icon: "fa fa-barcode"
            },{
                text: dados.componentes.sd.entrada,
                icon: "fa fa-calendar"
            }]
            },{
              text: "LCD",
              icon : "jstree-icon jstree-themeicon fa fa-folder m--font-brand jstree-themeicon-custom",
              children:
            [{
                text: dados.componentes.lcd.serie,
                icon: "fa fa-barcode"
            },{
                text: dados.componentes.lcd.entrada,
                icon: "fa fa-calendar"
            },{
                text: dados.componentes.lcd.status,
                icon: "fa fa-tv"
            }]
            },
            ]},
            ]
        this.modalService.tratarTreeJson("Info display", tree);
      },
      (error: any) => this.modalService.tratarError(error)
      ).add(() => {
        Helpers.setLoading(false);
      })
  }

// ÍCONE 4 - LIGAR DESLIGAR LCD
  openFormModalLigarDesligarLcd(rowId?: string) {
    if (this.p.status!="Desconectado"){
  Helpers.setLoading(true);
  this.onLigarDesligarMonitor()
        Helpers.setLoading(false);
        this.modalService.tratarMensagem("Ligar/Desligar LCD", "LCD ligado/desligado com sucesso.")
    }
}
  onLigarDesligarMonitor(){
    redirecionarPorta({
      action: "ligar_desligar_lcd",
      display: this.p.id
    });
  }

// ÍCONE 5 - REINICIAR DISPLAY
  openFormModalReiniciarDisplay(rowId?: string) {
    if (this.p.status!="Desconectado"){
      Helpers.setLoading(true);
      this.modalService.tratarConfirmacao("Reiniciar display", "Gostaria de reiniciar o display?").then(
        r => {
          if (r) {
            this.onReiniciarRasp();
          }
        }
      );
    }
  }
  onReiniciarRasp() {
    redirecionarPorta({
      action: "reiniciar_display",
      display: this.p.id
    });
  }

// ÍCONE 6 - EDITAR VÍNCULO
  openFormModal(rowId?: string) {
    consoleLog("Entrou no openFormModal")
    let ngbModalOptions: NgbModalOptions={
          backdrop: 'static',
          keyboard: false
      }
    const modalRef = this.modalNgb.open(PortasFormComponent, ngbModalOptions);
    modalRef.componentInstance.rowId = rowId;
    modalRef.result.then((responseSuccess) => {
      if (responseSuccess) {
      }
    })
  }
  openFormModalEditarVinculo(){
    if (this.p.status!="Desconectado" || this.p.raspberry==false){
      Helpers.setLoading(true);
      consoleLog("Entrou no openFormModalEditarVinculo")
      this.openFormModal(this.p.id);
    }
  }

// ÍCONE 7 - REMOVER VÍNCULO
  openFormModalRemoverVinculo(){
    // if (this.p.status!="Desconectado"){
      Helpers.setLoading(true);
      this.modalService.tratarConfirmacao("Remover vínculo", "Gostaria de remover o vínculo do display?").then(
        r => {
          if (r) {
            this.onRemoverVinculo();
          }
        }
      );
    // }
  }
  onRemoverVinculo(){
    Helpers.setLoading(true);
    this.webService.put(`displays/${this.p.id}/remover_vinculo`, {})
      .subscribe(
        response =>{
          Helpers.setLoading(false);
          this.modalService.tratarMensagem("Remover vínculo", response.body.message)
          this.refreshPortas.emit('')
        },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
  }

}