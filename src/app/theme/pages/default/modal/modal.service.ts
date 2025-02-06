import { Injectable } from "@angular/core";
import { SuccessModalComponent } from "./success-modal/success-modal.component";
import { ErrorModalComponent } from "./error-modal/error-modal.component";
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoModalComponent } from "./confirmacao-modal/confirmacao-modal.component";
import { Observable } from "rxjs/Observable";
import { MessageModalComponent } from "./message-modal/message-modal.component";
import { ServiceModalComponent } from './service-modal/service-modal.component';
import { TreeModalComponent } from "./tree-modal/tree-modal.component";
import { HttpErrorResponse, HttpRequest, HttpClient } from '@angular/common/http';
import { Helpers } from './../../../../helpers';
import { consoleLog } from '../../../../globals';
import { QrCodeModalComponent } from '../gerar-qrcode/qrcode-modal/qrcode-modal.component';
import { WebService } from '../../../../_services/web.service';
import { DomainService } from '../../../../_services/domain.service';
import { WorkspaceService } from '../../../../_services/workspace.service';
import { AngularTokenService } from 'angular-token';
import { HeadersService } from '../../../../_services/header.service';
import { BoasVindasModalComponent } from './boas-vindas-modal/boas-vindas-modal.component';
import { TrocarUnidadeModalComponent } from './trocar-unidade-modal/trocar-unidade-modal.component';
import { TrialExpiradoModalComponent } from "./trial-expirado-modal/trial-expirado-modal.component";
import { LoteModalComponent } from "./lote-modal/lote-modal.component";
import { ExclusaoModalComponent } from "./exclusao-modal/exclusao-modal.component";
import { TrialAgendadorModalComponent } from "./trial-agendador-modal/trial-agendador-modal.component";

declare function montarDataTree(data: any)

@Injectable()
export class ModalService {
  modalNgb:NgbModal;

  constructor(nm: NgbModal) {
    this.modalNgb = nm;
  }

  debugService(titulo, metodo, service){
    const msgModal = this.modalNgb.open(ServiceModalComponent);
    msgModal.componentInstance.titulo = titulo;
    msgModal.componentInstance.metodo = metodo;
    msgModal.componentInstance.service = service;
  }

  tratarMensagem(titulo, corpo) {
    const msgModal = this.modalNgb.open(MessageModalComponent);
    msgModal.componentInstance.titulo = titulo;
    msgModal.componentInstance.corpo = corpo;
    return msgModal.result
  }

  tratarTree(titulo) {
    const msgModal = this.modalNgb.open(TreeModalComponent);
    msgModal.componentInstance.titulo = titulo;
  }

  tratarTreeJson(titulo, json) {
    const msgModal = this.modalNgb.open(TreeModalComponent);
    msgModal.componentInstance.titulo = titulo;
    montarDataTree(json);
  }

  tratarSucesso(response, activeModal?) {
    Helpers.setLoading(false);
    if (response.status > 199 && response.status < 300) {
      if (activeModal != null) {
        activeModal.close(true) 
      };
      const successModal = this.modalNgb.open(SuccessModalComponent, { size: 'sm', centered: true});
      if (response.body != undefined){
        if (response.body.titulo != undefined){
          successModal.componentInstance.titulo = response.body.titulo;
        }
        if (response.body.corpo != undefined){
          successModal.componentInstance.corpo = response.body.corpo;
        }
      }
      successModal.result.then(
        r=> {
          if(r && activeModal){
            activeModal.close(true)
          }
        })
        .catch(e=>{
          // consoleLog("eita:"+ e)
        });
    } else {
      this.tratarError(response);
    }
  }

  tratarExclusao(titulo?) {
    const modal = this.modalNgb
      .open(ExclusaoModalComponent, { size: 'sm', centered: true })

    // modal.componentInstance.titulo = titulo;
    // modal.componentInstance.corpo = corpo;

    return modal.result;
  }

  tratarConfirmacao(titulo?, corpo?) {
    const modal = this.modalNgb
      .open(ConfirmacaoModalComponent, { size: 'sm', centered: true })
    modal.componentInstance.titulo = titulo;
    modal.componentInstance.corpo = corpo;
    return modal.result;
  }

  tratarLote(titulo?, primeiraOpcao?, segundaOpcao?) {
    const modal = this.modalNgb
      .open(LoteModalComponent, { size: 'sm', centered: true })
    if (titulo != undefined){ modal.componentInstance.titulo = titulo; }
    if (primeiraOpcao != undefined){ modal.componentInstance.primeiraOpcao = primeiraOpcao }
    if (segundaOpcao != undefined){ modal.componentInstance.segundaOpcao = segundaOpcao }
    return modal.result;
  }

  // tratarError(error: number) {
  //   consoleLog("como está vindo o erro:");
  //   consoleLog(error);
  //   const errorModal = this.modalNgb.open(ErrorModalComponent, { size: 'sm' });
  //   if (error.status == 422){
  //     //let jsonMsg = eval("(" + error._body + ")");
  //     let jsonMsg = eval("(" + error.error + ")");
  //     errorModal.componentInstance.message = jsonMsg.errors
  //   }else{
  //     errorModal.componentInstance.message = error;
  //   }
  //   // if (response.status == 422) {
  //     // consoleLog()
  // }

  tratarError(e: HttpErrorResponse, method?: String) {
    Helpers.setLoading(false);
    const errorModal = this.modalNgb.open(ErrorModalComponent, { size: 'sm', centered: true });
    if (e.status == 422){
      errorModal.componentInstance.message = e.error.errors
    }else if (e.status == 504){
      if(method == 'post' || method == 'put'){
        if(errorModal.componentInstance.message = e.url.includes("api/v1/reservas")){
          msg = 'Sua reserva ainda está sendo processada. Confira em seu Calendário em alguns minutos para validar se ela foi executada corretamente.'
        }else{
          msg = 'Sua solicitação ainda está sendo processada. Confira em alguns minutos para validar se ela foi executada corretamente.'
        }
      }else{
        msg = 'Sua solicitação não está sendo retornada por erro interno do nosso servidor. Tente novamente em alguns minutos, e caso o erro persista, entre em contato com o time da Calenda.'
      }

      errorModal.componentInstance.message = msg
    }else{
      var msg = `Ocorreu um erro ao contactar o servidor:  ${e.message}`;
      errorModal.componentInstance.message = msg;
    }
  }

  abrirBoasVindas(){
    const modal = this.modalNgb.open(BoasVindasModalComponent);
    return modal.result;
  }

  abrirTrialAgendador(){
    const modal = this.modalNgb.open(TrialAgendadorModalComponent);
    return modal.result;
  }

  abrirTrialExpirado(){
    const modal = this.modalNgb.open(TrialExpiradoModalComponent,
      { backdrop : 'static',
      keyboard : false
    });
    return modal.result;
  }

  trocarUnidade(){
    const unidadeModal = this.modalNgb.open(TrocarUnidadeModalComponent,{ size: 'sm', centered: true })
    return unidadeModal.result;
  }

}
