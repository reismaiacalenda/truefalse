import { Injectable } from "@angular/core";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs/Observable";
import { HttpErrorResponse } from '@angular/common/http';
import { Helpers } from '../../../../../helpers';
import { FormGroup, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { WebService } from '../../../../../_services/web.service';
import { ModalService } from '../../modal/modal.service';
import { FormService } from '../../../../../_services/form.service';
import { consoleLog } from '../../../../../globals';
import { CheckFormComponent } from './check/check-form.component';


@Injectable()
export class CheckModalService {
 
  modalCheck: NgbModalRef;

  formulario:FormGroup;

  constructor(public modalNgb: NgbModal,
      public formBuilder:FormBuilder,
      public workspaceService:WorkspaceService,
      public webService:WebService,
      public modalService:ModalService) {
  }

  fabricarModalCheckRecurso(recurso_reserva_id):Observable<any>{
    consoleLog("Entrou no fabricarModalCheckRecurso")
    consoleLog(recurso_reserva_id)
    return new Observable(observer=>{
      this.webService.get(`checks/new?recursos_reserva_id=${recurso_reserva_id}`)
      .subscribe(response=>{
        consoleLog("Entrou no subscribe")
        consoleLog(response);
        if (response['check_type'] == "in" || response['check_type']=="out" || response['check_type']=="list"){
          this.fabricarModalCheck(response)
          .subscribe(resultado=>{
            observer.next(resultado);
            observer.complete
          })
        }
      }
      ,
      (error: any) => {
        this.modalService.tratarError(error)
        Helpers.setLoading(false);
      })
    })
  }

  fabricarModalCheckEspaco(espaco_id):Observable<any>{
    consoleLog("Entrou na fabricarModalCheckEspaco")
    consoleLog(espaco_id)
    return new Observable(observer=>{
      this.webService.get(`checks/new?espaco_id=${espaco_id}`)
      .subscribe(response=>{
        consoleLog(response);
        if (response['check_type'] == "in" || response['check_type']=="out"){
          this.fabricarModalCheck(response)
          .subscribe(resultado=>{
            observer.next(resultado);
            observer.complete
          })
        }
      }
      ,
      (error: any) => {
        this.modalService.tratarError(error)
        Helpers.setLoading(false);
      })
    })
  }

  fabricarModalCheckUnidade(unidade_id):Observable<any>{
    consoleLog("Entrou na fabricarModalCheckUnidade")
    consoleLog(unidade_id)
    return new Observable(observer=>{
      this.webService.get(`checks/new?unidade_id=${unidade_id}`)
      .subscribe(response=>{
        if (response['check_type'] == "in" || response['check_type']=="out"){
          this.fabricarModalCheck(response)
          .subscribe(resultado=>{
            observer.next(resultado);
            observer.complete
          })
        }
      }
      ,
      (error: any) => {
        this.modalService.tratarError(error)
        Helpers.setLoading(false);
      })
    })
  }

  fabricarModalCheck(dados):Observable<any>{
    consoleLog("Entrou no fabricarModalCheck")
    consoleLog(dados)
    //, tipoModal='simples', tela
    return new Observable(observer=>{
      this.construirFormulario(dados);
      // if (tipoModal == 'simples'){
        this.abrirModalCheck()
          .then(resultadoModalCheck=>{
            observer.next(resultadoModalCheck)
            observer.complete;
          })
      // }else {
      //   observer.next(false)
      //   observer.complete;
      // }
    })
  }

  // http://localhost:4200/?e=1

  construirFormulario(dados){
    consoleLog("Entrou no construirFormulario")
    consoleLog(dados)
    this.formulario = this.formBuilder.group({
      id: [null],
      checkable_id: [null],
      checkable_type: [null],
      check_type: [null],
      assunto: [null],
      espaco: [null],
      horario: [null],
      anfitriao: [null],
      titulo: [null],
      corpo: [null],
      nome_botao: [null],
      recurso: [null],
      quantidade: [null],
      data_retirada: [null],
      data_retirada_prevista: [null],
      data_ocupacao: [null],
      data_ocupacao_prevista: [null],
      data_devolucao_prevista: [null],
      data_instalacao: [null],
      data_instalacao_prevista: [null],
      data_servico: [null],
      data_alocacao_prevista: [null],
      data_recolhimento_previsto: [null],
      data_alocacao: [null]
    })
    FormService.patchValueWithFormArray(this.formulario, dados);
    // consoleLog("Construir formulário")
    // consoleLog(dados);
    // consoleLog("Olha o formulário")
    // consoleLog(this.formulario);
  }

  abrirModalCheck():Promise<any>{
    consoleLog("Entrou no construirFormulario")

    Helpers.setLoading(true);
    
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false
    }
    consoleLog("Antes de chamar o CheckFormComponent")
    this.modalCheck = this.modalNgb.open(CheckFormComponent, ngbModalOptions);
    consoleLog("Depois de chamar o CheckFormComponent")
    this.modalCheck.componentInstance.CheckModalService = this;
    this.modalCheck.componentInstance.formulario = this.formulario;
    this.modalCheck.componentInstance.rowId = this.formulario.get('id').value;
    consoleLog("Depois de chamar o CheckFormComponent")
    consoleLog(this.modalCheck.componentInstance.formulario)
    return this.modalCheck.result;
  }

}
