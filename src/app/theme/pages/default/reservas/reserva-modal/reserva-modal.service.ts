// import { SuccessModalComponent } from "./success-modal/success-modal.component";
// import { ErrorModalComponent } from "./error-modal/error-modal.component";
// import { ConfirmacaoModalComponent } from "./confirmacao-modal/confirmacao-modal.component";
// import { MessageModalComponent } from "./message-modal/message-modal.component";
// import { TreeModalComponent } from "./tree-modal/tree-modal.component";
import { Injectable } from "@angular/core";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { HttpErrorResponse } from '@angular/common/http';
import { Helpers } from '../../../../../helpers';
import { ReservaModalSimplesFormComponent } from './reserva-modal-simples/reserva-modal-simples-form.component';
import { ReservaModalAvancadaFormComponent } from './reserva-modal-avançada/reserva-modal-avancada-form.component';
import { ConfigTelaReservaFormComponent } from './config-tela-reserva/config-tela-reserva-form.component';
import { RecursoFormComponent } from './recursos/recursos-form.component';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ConvidadoFormComponent } from './convidados/convidados-form.component';
import { of, Subscription } from 'rxjs';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { WebService } from '../../../../../_services/web.service';
import { ModalService } from '../../modal/modal.service';
import { FormService } from '../../../../../_services/form.service';
import { consoleLog } from '../../../../../globals';
import { InstalarRecursoFormComponent } from './Instalar-recursos/Instalar-recursos-form.component';
import { ParametrizacaoFormComponent } from './parametrizacoes/parametrizacao-form.component';
import { CamposCustomizadosPreDefinidosComponent } from './campos-customizados-pre-definidos/campos-customizados-pre-definidos.component';
import { ReservaPostoTrabalhoFormComponent } from './reserva-posto-trabalho/reserva-posto-trabalho-form.component';
import { EquipagemFormComponent } from './equipagem/equipagem-form.component';
import { EmprestimoFormComponent } from './emprestimo/emprestimo-form.component';
import { RecorrenciaFormComponent } from './recorrencia/recorrencia-form.component';
import { CancelarReservaModalComponent } from './cancelar-reserva-modal/cancelar-reserva-modal.component';
import { ConvidarFormComponent } from './convidar/convidar-form.component';
import { PegarEquipamentoComponent } from "./acoes/pegar-equipamento/pegar-equipamento.component";
import { PessoaPegarEquipamentoComponent } from "./acoes/pegar-equipamento/pessoa-pegar-equipamento.component";
import { MapaModalFormComponent } from '../mapa/mapa-modal/mapa-modal-form.component';
import { CheckupsService } from "../../cadastros/checkups/checkups.service";
import { ReservaEstacaoFlexivelFormComponent } from "./reserva-estacao-flexivel/reserva-estacao-flexivel-form.component";
import { ReservaEstacionamentoFormComponent } from "./reserva-estacionamento/reserva-estacionamento-form.component";
import { ReservaFretadoFormComponent } from "./reserva-fretado/reserva-fretado-form.component";
import { CheckupsComponent } from "../../cadastros/checkups/checkups.component";
import { AgendaDoDiaComponent } from "./consultar/agenda-do-dia/agenda-do-dia.component";
import { DetalheReservaComponent } from "./consultar/detalhe-reserva/detalhe-reserva.component";
import { TrabalharEscritorioComponent } from "./acoes/trabalhar-escritorio/trabalhar-escritorio.component";
import { KitEstandeFormComponent } from "./kit-estande/kit-estande-form.component";
import { ModalTermoComponent } from "../mapa/modal-termo/modal-termo.component";
import { ModalMaisOpcoesComponent } from "./modal-mais-opcoes/modal-mais-opcoes.component";
import { SelecionarMapaQuadrosComponent } from "./acoes/mapa-smartrooms/selecionar-mapa-quadros.component";

@Injectable()
export class ReservaModalService {
  [x: string]: any;
  tela;

  modalSimples: NgbModalRef;
  modalAvancada: NgbModalRef;
  modalConvidar: NgbModalRef;
  modalRecursos: NgbModalRef;
  modalConvidados: NgbModalRef;
  modalInstalacao: NgbModalRef;
  modalCheckIn: NgbModalRef;
  modalCheckOut: NgbModalRef;
  modalPostoTrabalho: NgbModalRef;
  modalEquipagem: NgbModalRef;
  modalEmprestimo: NgbModalRef;
  modalKitEstande: NgbModalRef;

  formulario:FormGroup;
  flagNewSendoSetada:boolean = false;

  constructor(public modalNgb: NgbModal,
      public formBuilder:FormBuilder,
      public workspaceService:WorkspaceService,
      public webService:WebService,
      public modalService:ModalService,
      public checkupsService:CheckupsService) {
  }

  openFormModalNew(tipoModal, body):Observable<any>{
    consoleLog("entru no form modal new")
    Helpers.setLoading(true);
    return new Observable(observer=>{
      consoleLog("preparando body para /new")
      consoleLog(body)
      // this.subscriptions.add(
        this.webService.get(`reservas/new`, body)
        .subscribe(
          dados => {      
            consoleLog("retornando os dados para chamar asssessoriasta");
            // this.subscriptions.add(
              this.fabricarAssessorista(tipoModal, body.tela, dados)
              .subscribe(resultadoModal => {
                if (resultadoModal == true) {
                  observer.next(true)
                  Helpers.setLoading(false);
                }
              })
            // )
            Helpers.setLoading(false)
          },
          (error: any) => {
            this.modalService.tratarError(error)
            Helpers.setLoading(false);
          }
        )
      // )
    })
  }

  fabricarAssessorista(tipoModal, tela, dados?):Observable<any>{
    return new Observable(observer=>{
      this.tela = tela
      this.construirFormulario(dados);
      if (tipoModal == 'simples'){
        this.abrirModalReservaSimples()
          .then(resultadoModalSimples=>{
            if (resultadoModalSimples=="reservaAvancada"){
              this.modalSimples.close();
              this.abrirModalReservaAvancada()
              .then(resultadoModalAvancada => {
                observer.next(resultadoModalAvancada)
                observer.complete;
              })
            }
            else {
              observer.next(resultadoModalSimples)
              observer.complete;
            }
          })
      }else if (tipoModal == 'eventos'){
        this.abrirModalReservaAvancada()
        .then(resultadoModalAvancada=>{
          observer.next(resultadoModalAvancada)
          observer.complete;
        })
      }else if (tipoModal == 'instalacoes'){
        this.abrirModalInstalacao()
        .then(resultadoModalInstalacao=>{
          observer.next(resultadoModalInstalacao)
          observer.complete;
        })
      }else if (tipoModal == 'postos_de_trabalho'){
        this.abrirModalPostoTrabalho()
        .then(resultadoModalPostoTrabalho=>{
          observer.next(resultadoModalPostoTrabalho)
          observer.complete;
        })
      }else if (tipoModal == 'estacoes_flexiveis'){
        this.abrirModalEstacaoFlexivel()
        .then(resultadoModalEstacaoFlexivel=>{
          observer.next(resultadoModalEstacaoFlexivel)
          observer.complete;
        })
      }else if (tipoModal == 'estacionamentos'){
        this.abrirModalEstacionamento()
        .then(resultadoModalEstacionamento=>{
          observer.next(resultadoModalEstacionamento)
          observer.complete;
        })
      }else if (tipoModal == 'fretados'){
        this.abrirModalFretado()
        .then(resultadoModalFretado=>{
          observer.next(resultadoModalFretado)
          observer.complete;
        })
      }else if (tipoModal == 'equipagens'){
        this.abrirModalEquipagem()
        .then(resultadoModalEquipagem=>{
          observer.next(resultadoModalEquipagem)
          observer.complete;
        })
      }else if (tipoModal == 'emprestimos'){
        // consoleLog("Entrou na Empréstimo")
        this.abrirModalEmprestimo()
        .then(resultadoModalEmprestimo=>{
          observer.next(resultadoModalEmprestimo)
          observer.complete;
        })
      }else if (tipoModal == 'kit_estandes'){
        // consoleLog("Entrou na Empréstimo")
        this.abrirModalKitEstande()
        .then(resultadoModalKitEstande=>{
          observer.next(resultadoModalKitEstande)
          observer.complete;
        })
      }else{
        observer.next(false)
        observer.complete;
      }
    })
  }
  
  construirFormulario(dados?){
  // consoleLog("dados")
  // consoleLog(dados)
    this.formulario = this.formBuilder.group({
      id: [null],
      unidade_id: [null],
      criador_id: [null],
      anfitriao_id: [null],
      anfitriao_email: [null], 
      convidados: this.formBuilder.array([]),//this.initFormArrayName('convidados'),
      convidados_emails: [null],
      qtd_convidados: [null],

      data_inicio: [null],
      data_fim: [null],
      hr_inicio_previsto: [null],
      hr_fim_previsto: [null],
      diferenca_horario: [null],
      periodo_indeterminado: [null],
      dia_todo: [false],
      numero_lote: [null],
      recorrencia: this.formBuilder.group({
        repeticao: [null],
        intervalo: [null],
        dias: [[]],
        termina_em: [false],
        termina_apos: [false],
        data_fim: [null],
        ocorrencia: [null],
        quando: [null]
      }),

      titulo_reserva: [null],
      espaco_id: [null],
      recurso_id: [null],
      pessoa_id: [null],
      // espacos_reserva_attributes: [null],//this.initFormArrayName('espacos_reserva_attributes'),
    
      amenities: [null],
      recursos_reservas_attributes: this.formBuilder.array([]),//this.initFormArrayName('recursos_reservas_attributes')

      total_a_pagar: [null],
      exibir_gastos: [null],
      subtotal: [null],
      desconto: [null],
      generate_link_conference: [null],
      calendario_conference_url: [null],
      private_subject: [null],
      assunto: [null],
      observacao: [null],
      tela: [null],
      tipo_reserva: [null],
      campos_customizados_reservas_attributes: this.formBuilder.array([
        this.formBuilder.group({
          id: [null],
          campos_customizado_id: [null],
          valor: [null],
          nome_atributo: [null],
        })
      ]),
      montar_tela: [null],
      local: [null],
      eventos_estandes_eventos_attributes: this.formBuilder.array([])
    })
    if (dados != undefined){
      FormService.patchValueWithFormArray(this.formulario, dados);
    }
    consoleLog("construir formulário")
    consoleLog(dados);
    consoleLog("olha o formulário")
    consoleLog(this.formulario);
    // consoleLog(this.formulario.get('funcionarios_attributes').value);
  }

  chamarNew(body){
  // consoleLog("chamando new")
    this.flagNewSendoSetada = true;
    Helpers.setLoading(true);
    if (body == undefined || body == null){
      body = {
        data: this.formulario.get('data_inicio').value,
        tela: this.tela
      }
      if (this.formulario.get('espaco_id') != undefined && this.formulario.get('espaco_id').value != undefined){
        body['espaco_id'] = this.formulario.get('espaco_id').value;
      }
      if (this.formulario.get('pessoa_id') != undefined && this.formulario.get('pessoa_id').value != undefined){
        body['pessoa_id'] = this.formulario.get('pessoa_id').value;
      }
      if (this.formulario.get('recurso_id') != undefined && this.formulario.get('recurso_id').value != undefined){
        body['recurso_id'] = this.formulario.get('recurso_id').value;
      }
    }
    this.webService.get(`reservas/new`, body)
      .subscribe(
        dados => {
        // consoleLog("retorno, vai rolar o patch, olha o body");
        // consoleLog(body)
        // consoleLog("e olha os dados q vieram da response:")
        // consoleLog(dados);
          var backupForm = {...this.formulario.value};
          FormService.patchValueWithFormArray(this.formulario, dados);
          if (body != undefined || body != null){
            this.restoreBackupFormNew(backupForm);
          }

          consoleLog("chamar new")
        // consoleLog("terminou o patch");
          this.flagNewSendoSetada = false;
          // consoleLog(this.formulario.get('funcionarios_attributes').value);
          Helpers.setLoading(false);
         },
         (error: any) => {
           this.modalService.tratarError(error);
           Helpers.setLoading(false);
           this.flagNewSendoSetada = false;
         }
       )
  }

  restoreBackupFormNew(backupForm){
  // consoleLog("backuuup")
  // consoleLog(backupForm);
    this.formulario.get('anfitriao_email').setValue(backupForm.anfitriao_email)
    this.formulario.get('convidados_emails').setValue(backupForm.convidados_emails)
    this.formulario.get('qtd_convidados').setValue(backupForm.qtd_convidados)
    if (backupForm.id != undefined && backupForm.id > 0){
    // consoleLog("tamo aqui no loop pro backup");
      // (<FormArray>this.formulario.get('campos_customizados_reservas_attributes'))
      //   .controls.forEach((fgroup:FormGroup, index) => {
      //   // consoleLog("index:" + index);
      //   // consoleLog("fgroup");
      //   // consoleLog(fgroup);
      //   // consoleLog("backup na posicao:")
      //   // consoleLog(backupForm.campos_customizados_reservas_attributes[index]);

      //     fgroup.patchValue(backupForm.campos_customizados_reservas_attributes[index]);

      //   })

      // for (let fgroup:FormGroup of (<FormArray>this.formulario.get('campos_customizados_reservas_attributes')).controls){
        // fgroup
      // } 
      // Object.keys()
      // .forEach(key:FormGroup => {
        // (<FormGroup>key).
        
        // if (formulario.controls[key] instanceof FormArray){
        //   formulario.controls[key].clear();
        //   if (dados[key]){
        //     dados[key].forEach(e => {
        //       consoleLog("form.service 63:");
        //       consoleLog(e);
        //       var fcontrol = formBuilder.group(e);
        //       (<FormArray>formulario.controls[key]).push(fcontrol)
        //     });
        //   }
      // })

      this.formulario.get('campos_customizados_reservas_attributes').setValue(backupForm.campos_customizados_reservas_attributes)
    }
    this.formulario.get('assunto').setValue(backupForm.assunto)
    this.formulario.get('observacao').setValue(backupForm.observacao)
    this.formulario.get('calendario_conference_url').setValue(backupForm.calendario_conference_url)
    this.formulario.get('private_subject').setValue(backupForm.private_subject)
  }

  abrirModalReservaSimples():Promise<any>{
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false,
      size: 'sm'
    }
    this.modalSimples = this.modalNgb.open(ReservaModalSimplesFormComponent, ngbModalOptions);
    this.modalSimples.componentInstance.reservaModalService = this;
    this.modalSimples.componentInstance.formulario = this.formulario;
    this.modalSimples.componentInstance.rowId = this.formulario.get('id').value;
    this.modalSimples.componentInstance.formArrayName = 'recursos_reservas_attributes';
    return this.modalSimples.result;
  }

  abrirModalReservaAvancada():Promise<any>{
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false//,
      // size: 'lg'
    }
    this.modalAvancada = this.modalNgb.open(ReservaModalAvancadaFormComponent, ngbModalOptions);
    this.modalAvancada.componentInstance.reservaModalService = this;
    this.modalAvancada.componentInstance.formulario = this.formulario;
    this.modalAvancada.componentInstance.rowId = this.formulario.get('id').value;
    this.modalAvancada.componentInstance.formArrayName = 'recursos_reservas_attributes';
    return this.modalAvancada.result;
  }

  abrirModalConvidarPessoas(){
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false
    }
    const modalRef = this.modalNgb.open(ConvidarFormComponent,ngbModalOptions);
    Helpers.setLoading(false);
  }
  
  abrirModalInstalacao():Promise<any>{
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false,
    }
    this.modalInstalacao = this.modalNgb.open(InstalarRecursoFormComponent, ngbModalOptions);
    this.modalInstalacao.componentInstance.reservaModalService = this;
    this.modalInstalacao.componentInstance.formulario = this.formulario;
    this.modalInstalacao.componentInstance.rowId = this.formulario.get('id').value;
    this.modalInstalacao.componentInstance.formArrayName = 'recursos_reservas_attributes';
    return this.modalInstalacao.result;
  }

  abrirModalPostoTrabalho():Promise<any>{
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false,
    }
    this.modalPostoTrabalho = this.modalNgb.open(ReservaPostoTrabalhoFormComponent, ngbModalOptions);
    this.modalPostoTrabalho.componentInstance.reservaModalService = this;
    this.modalPostoTrabalho.componentInstance.formulario = this.formulario;
    this.modalPostoTrabalho.componentInstance.rowId = this.formulario.get('id').value;
    // this.modalPostoTrabalho.componentInstance.anfitriao_id = this.formulario.get('anfitriao_id').value;
    // this.modalPostoTrabalho.componentInstance.formArrayName = 'criador_id';
    return this.modalPostoTrabalho.result;
  }

  abrirModalEstacaoFlexivel():Promise<any>{
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false,
    }
    this.modalPostoTrabalho = this.modalNgb.open(ReservaEstacaoFlexivelFormComponent, ngbModalOptions);
    this.modalPostoTrabalho.componentInstance.reservaModalService = this;
    this.modalPostoTrabalho.componentInstance.formulario = this.formulario;
    this.modalPostoTrabalho.componentInstance.rowId = this.formulario.get('id').value;
    // this.modalPostoTrabalho.componentInstance.anfitriao_id = this.formulario.get('anfitriao_id').value;
    // this.modalPostoTrabalho.componentInstance.formArrayName = 'criador_id';
    return this.modalPostoTrabalho.result;
  }

  abrirModalEstacionamento():Promise<any>{
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false,
    }
    this.modalPostoTrabalho = this.modalNgb.open(ReservaEstacionamentoFormComponent, ngbModalOptions);
    this.modalPostoTrabalho.componentInstance.reservaModalService = this;
    this.modalPostoTrabalho.componentInstance.formulario = this.formulario;
    this.modalPostoTrabalho.componentInstance.rowId = this.formulario.get('id').value;
    // this.modalPostoTrabalho.componentInstance.anfitriao_id = this.formulario.get('anfitriao_id').value;
    // this.modalPostoTrabalho.componentInstance.formArrayName = 'criador_id';
    return this.modalPostoTrabalho.result;
  }

  abrirModalFretado():Promise<any>{
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false,
    }
    this.modalPostoTrabalho = this.modalNgb.open(ReservaFretadoFormComponent, ngbModalOptions);
    this.modalPostoTrabalho.componentInstance.reservaModalService = this;
    this.modalPostoTrabalho.componentInstance.formulario = this.formulario;
    this.modalPostoTrabalho.componentInstance.rowId = this.formulario.get('id').value;
    // this.modalPostoTrabalho.componentInstance.anfitriao_id = this.formulario.get('anfitriao_id').value;
    // this.modalPostoTrabalho.componentInstance.formArrayName = 'criador_id';
    return this.modalPostoTrabalho.result;
  }

  abrirModalEquipagem():Promise<any>{
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false,
    }
    this.modalEquipagem = this.modalNgb.open(EquipagemFormComponent, ngbModalOptions);
    this.modalEquipagem.componentInstance.reservaModalService = this;
    this.modalEquipagem.componentInstance.formulario = this.formulario;
    this.modalEquipagem.componentInstance.rowId = this.formulario.get('id').value;
    this.modalEquipagem.componentInstance.formArrayName = 'recursos_reservas_attributes';
    return this.modalEquipagem.result;
  }

  abrirModalEmprestimo():Promise<any>{
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false,
    }
    this.modalEmprestimo = this.modalNgb.open(EmprestimoFormComponent, ngbModalOptions);
    this.modalEmprestimo.componentInstance.reservaModalService = this;
    this.modalEmprestimo.componentInstance.formulario = this.formulario;
    this.modalEmprestimo.componentInstance.rowId = this.formulario.get('id').value;
    this.modalEmprestimo.componentInstance.formArrayName = 'recursos_reservas_attributes';
    // consoleLog(this.modalEmprestimo.result)
    return this.modalEmprestimo.result;
  }

  abrirModalKitEstande():Promise<any>{
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false,
    }
    this.modalKitEstande = this.modalNgb.open(KitEstandeFormComponent, ngbModalOptions);
    this.modalKitEstande.componentInstance.reservaModalService = this;
    this.modalKitEstande.componentInstance.formulario = this.formulario;
    this.modalKitEstande.componentInstance.rowId = this.formulario.get('id').value;
    this.modalKitEstande.componentInstance.formArrayName = 'recursos_reservas_attributes';
    // consoleLog(this.modalKitEstande.result)
    return this.modalKitEstande.result;
  }

  // abrirModalAddRecursos():Promise<any>{
  //   Helpers.setLoading(true);
  //   let ngbModalOptions: NgbModalOptions={
  //     backdrop: 'static',
  //     keyboard: false,
  //   }
  //   this.modalRecursos = this.modalNgb.open(RecursoFormComponent, ngbModalOptions);
  //   this.modalRecursos.componentInstance.reservaModalService = this;
  //   this.modalRecursos.componentInstance.formulario = this.formulario;
  //   this.modalRecursos.componentInstance.rowId = this.formulario.get('id').value;
  //   this.modalRecursos.componentInstance.formArrayName = 'recursos_reservados_attributes';
  //   return this.modalRecursos.result;
  // }

  abrirModalAddConvidados():Promise<any>{
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false,
    }
    consoleLog("abrir cnonvidados")
    consoleLog(this.formulario.get('funcionarios_attributes').value);
    this.modalConvidados = this.modalNgb.open(ConvidadoFormComponent, ngbModalOptions);
    this.modalConvidados.componentInstance.reservaModalService = this;
    this.modalConvidados.componentInstance.formulario = this.formulario;
    this.modalConvidados.componentInstance.rowId = this.formulario.get('id').value;
    this.modalConvidados.componentInstance.formArrayName = 'recursos_reservados_attributes';
    return this.modalConvidados.result;
  }

  abrirModalRecorrencia():Promise<any>{
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false,
      size: 'sm'
    }
    // consoleLog("abrir cnonvidados")
    // consoleLog(this.formulario.get('funcionarios_attributes').value);
    this.modalConvidados = this.modalNgb.open(RecorrenciaFormComponent, ngbModalOptions);
    this.modalConvidados.componentInstance.reservaModalService = this;
    this.modalConvidados.componentInstance.formulario = this.formulario;
    this.modalConvidados.componentInstance.pegarDia();
    this.modalConvidados.componentInstance.marcarAutomaticamente();
    this.modalConvidados.componentInstance.rowId = this.formulario.get('id').value;
    // this.modalConvidados.componentInstance.formArrayName = 'recursos_reservados_attributes';
    return this.modalConvidados.result;
  }

  configTelaReserva(){
    Helpers.setLoading(true);
    // this.webService.get(`config_tela_reservas/edit`, {})
    // .subscribe(
      // response =>{
        let ngbModalOptions: NgbModalOptions={
          backdrop: 'static',
          keyboard: false,
          size: 'lg'
        }
        const modalRef = this.modalNgb.open(ConfigTelaReservaFormComponent,ngbModalOptions);
        Helpers.setLoading(false);
      // },
      // (error) =>{
        // Helpers.setLoading(false);
        // this.modalService.tratarError(error);
      // }
    // )
  }

  parametrizacoes(){
    Helpers.setLoading(true);
        let ngbModalOptions: NgbModalOptions={
          backdrop: 'static',
          keyboard: false,
          size: 'lg'
        }
        const modalRef = this.modalNgb.open(ParametrizacaoFormComponent,ngbModalOptions);
        Helpers.setLoading(false);
  }

  predefinidos(){
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    }
    const modalRef = this.modalNgb.open(CamposCustomizadosPreDefinidosComponent,ngbModalOptions);
    Helpers.setLoading(false);
  }

  tratarCancelamentoReserva(id, activeModal?) {
    const modalCancelamento = this.modalNgb.open(CancelarReservaModalComponent, { size: 'sm', centered: true})
    modalCancelamento.componentInstance.id = id;
    if (activeModal){
      modalCancelamento.componentInstance.modalExterna = activeModal;
    }
    return modalCancelamento.result;
  }

  //#region Pegar Equipamento
  
  abrirModalPegarEquipamento():Promise<any>{
    // this.construirFormulario();
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      // backdrop: 'static',
      // keyboard: false,
      centered: true
    }
    let modal = this.modalNgb.open(PegarEquipamentoComponent, ngbModalOptions);
    modal.result.then(r=>{
      switch (r) {
        case 'pessoa':
            this.abrirModalPessoaPegarEquipamento();
          break;

        default:
          break;
      } 
    })
    // modal.componentInstance.reservaModalService = this;
    // modal.componentInstance.formulario = this.formulario;
    // modal.componentInstance.rowId = this.formulario.get('id').value;
    // modal.componentInstance.formArrayName = 'recursos_reservados_attributes';
    return modal.result;

  }

  abrirModalSelecionarMapaQuadros():Promise<any>{
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      centered: true
    }
    let modal = this.modalNgb.open(SelecionarMapaQuadrosComponent, ngbModalOptions);
    modal.result.then(r=>{
      switch (r) {
        case 'pessoa':
            this.abrirModalSelecionarMapaQuadros();
          break;

        default:
          break;
      } 
    })
    // modal.componentInstance.reservaModalService = this;
    // modal.componentInstance.formulario = this.formulario;
    // modal.componentInstance.rowId = this.formulario.get('id').value;
    // modal.componentInstance.formArrayName = 'recursos_reservados_attributes';
    return modal.result;

  }

  abrirModalPessoaPegarEquipamento():Promise<any>{
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      // backdrop: 'static',
      // keyboard: false,
    }
    let modal = this.modalNgb.open(PessoaPegarEquipamentoComponent, ngbModalOptions);
    modal.result.then(r=>{
      switch (r) {
        case 'return':
          this.abrirModalPegarEquipamento();
          break;
        case 'equipar':
          this.abrirModalEquipagem();
          break;
        case 'emprestar':
          this.abrirModalEmprestimo();
          break;
        default:
          break;
      }
    })
    
    return modal.result;
  }

  abrirModalMapaForm():any{
    // this.construirFormulario();
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      // backdrop: 'static',
      // keyboard: false,
      centered: true
    }
    let modal = this.modalNgb.open(MapaModalFormComponent, ngbModalOptions);
  }

  abrirModalSalaReservada(espacoSelecionado, textData, modalSalaReserva):NgbModalRef{
    // this.construirFormulario();
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      // keyboard: false,
      centered: true
    }
    let modal = this.modalNgb.open(modalSalaReserva, ngbModalOptions);
    modal.componentInstance.espacoSelecionado = espacoSelecionado;
    modal.componentInstance.textData = textData;
    return modal;
  }

  abrirModalContinuacaoReserva(modalContinuacaoReservaComponent):NgbModalRef{
    // this.construirFormulario();
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
       backdrop: 'static',
      // keyboard: false,
      centered: true
    }

    //TODO: if da trigger, se > X chamar a open NpsComponent, colocada dentro de uma modal ModalNpsComponent

    let modal = this.modalNgb.open(modalContinuacaoReservaComponent, ngbModalOptions);
    return modal;
  }

  abrirModalTermo(modalTermoComponent):NgbModalRef{
    // this.construirFormulario();
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
       backdrop: 'static',
      // keyboard: false,
      centered: true
    }
    let modal = this.modalNgb.open(modalTermoComponent, ngbModalOptions);
    return modal;
  }

  abrirModalMaisOpcoes():NgbModalRef{
    // this.construirFormulario();
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
       backdrop: 'static',
      // keyboard: false,
      centered: true
    }
    let modal = this.modalNgb.open(ModalMaisOpcoesComponent, ngbModalOptions);
    return modal;
  }

  //#endregion

  abrirModalAgendaDoDia(entidade, id, nomeAtivo, data):Observable<any>{
    Helpers.setLoading(true);
    consoleLog("abrindo modal Agenda do Dia");
    return new Observable(observer=>{
      this.webService.get(`reservas/agenda_do_dia`, {entidade: entidade, id: id, data: data})
      .subscribe(
        response =>{
          let ngbModalOptions: NgbModalOptions={
            backdrop: 'static',
            keyboard: true,
            centered: true
          }
          const modal = this.modalNgb.open(AgendaDoDiaComponent, ngbModalOptions)
          modal.componentInstance.reservas = response;
          modal.componentInstance.nomeAtivo = nomeAtivo;
          modal.componentInstance.data = data;
          modal.result.then((resultado)=>{
            if (resultado!=undefined && resultado>0){
              this.abrirModalDetalheReserva(resultado)
              .subscribe(r=>{
                consoleLog("retornando do edit do card")
                consoleLog(r);
                // if (r == true){
                //   this.refreshQuadro.emit('');
                // }
                observer.next(r);
              });
            }else{
              observer.next(resultado);
              observer.complete();
            }
          })
          Helpers.setLoading(false);
        },
        (error) =>{
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
          // observer.next(false);
          // observer.complete
        }
      )
    })
  }

  abrirModalDetalheReserva(reserva_id):Observable<any>{
    consoleLog("entru no abrirModalDetalheReserva do service")
    return new Observable(observer=>{
      let ngbModalOptions: NgbModalOptions={
        backdrop: 'static',
        keyboard: true,
        centered: true
        // size: 'lg'
      }
      consoleLog("inicou chamada na api de show de reserva")
      this.webService.get(`reservas/${reserva_id}`)
      .subscribe(
        response =>{
          consoleLog("retornou com sucesso dado da api. vai chamar a modal de detalhe pra montar realmente")
          const modalDetalheReserva = this.modalNgb.open(DetalheReservaComponent, ngbModalOptions)
          modalDetalheReserva.componentInstance.reserva = response
          modalDetalheReserva.componentInstance.id = reserva_id
          modalDetalheReserva.result.then(resultado=>{
            consoleLog("retorno da modal de detalhe da reserva. resultado:")
            consoleLog(resultado);
            observer.next(resultado);
            observer.complete;
          })

        },
        (error: any) => {
          observer.next(false);
          observer.complete
          this.modalService.tratarError(error)
          Helpers.setLoading(false);

        }
      )
    })
  }

  //#endregion


  //#region abrirTrabalharEscritorio
  abrirTrabalharEscritorio(){
    // Helpers.setLoading(true);

    // let ngbModalOptions: NgbModalOptions={
    //   // backdrop: 'static',
    //   // keyboard: false,
    // }
    // let modal = this.modalNgb.open(TrabalharEscritorioComponent, ngbModalOptions);
    // modal.result.then(r=>{
    //   switch (r) {
    //     case 'pessoa':
    //         this.abrirModalPessoaPegarEquipamento();
    //       break;

    //     default:
    //       break;
    //   } 
    // })
    // modal.componentInstance.reservaModalService = this;
    // modal.componentInstance.formulario = this.formulario;
    // modal.componentInstance.rowId = this.formulario.get('id').value;
    // modal.componentInstance.formArrayName = 'recursos_reservados_attributes';
    // return modal.result;
    Helpers.setLoading(true);
    var body = {
      // espaco_id: undefined,
      tela: "mapa_espaco_estacoes_flexiveis", //TODO: dinamizar tela da ultima interação. ex: qrcode_check_on.
      data: (new Date).toLocaleDateString("PT")//this.data
    }
    var tipoModal = 'eventos';
    if (Helpers.isMobile() == true){
      tipoModal = 'simples';
    }
    this.webService.get(`reservas/new`, body)
    .subscribe(
      dados => {
        this.fabricarAssessorista('estacoes_flexiveis', 'mapa_espaco_estacoes_flexiveis', dados)
          .subscribe(resultadoModal => {
            if (resultadoModal == true) {
              consoleLog("disparando emitt refresh quadro")
              // this.refreshQuadro.emit('');
            }
          })
        Helpers.setLoading(false)
      },
      (error: any) => {
        this.modalService.tratarError(error)
        Helpers.setLoading(false);
      }
    )
  }
  //#endregion
}
