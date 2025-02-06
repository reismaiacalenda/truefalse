import { WebService } from '../../../../../../../_services/web.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Helpers } from '../../../../../../../helpers';
import { ModalService } from '../../../../modal/modal.service';
import { DomainService } from '../../../../../../../_services/domain.service';
import { NgbModalOptions, NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatatableService } from '../../../../../../../_services/datatable.service';
import { HeadersService } from '../../../../../../../_services/header.service';
import { ReservaModalService } from '../../../reserva-modal/reserva-modal.service';
// import { ReservaModalSimplesFormComponent } from '../../reserva-modal/reserva-modal-simples/reserva-modal-simples-form.component';
// import { Subscription } from 'rxjs';
// import { QuadroFormComponent } from '../quadro-form/quadro-form.component';
import { consoleLog } from '../../../../../../../globals';
import { CheckModalService } from '../../../checks-modal/check-modal.service';
import { GerarQrCodeModalService } from '../../../../gerar-qrcode/gerar-qrcode.service';
import { EspacoFormComponent } from '../../../../cadastros/espacos/espaco/espaco-form/espaco-form.component';
import { WorkspaceService } from '../../../../../../../_services/workspace.service';
import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';

declare function redirecionarQuadro(data): any;

@Component({
  moduleId: module.id,
  templateUrl: "./card.component.html",
  selector: "card",
})

export class CardComponent implements OnInit, OnChanges {
  @Input() localizacao: any;
  @Input() card: any;
  @Input() data: any;
  @Input() horaInicio: any;
  @Input() horaFim: any;
  @Output() refreshQuadro = new EventEmitter();
  public activeModal: NgbActiveModal;
  public modalRecursos: NgbModalRef;
  flagSegurarDropdownAcoes: boolean = false;
  flagSegurarDropdownRecursos: boolean = false;
  // apiUrl: string;
  // entidade_url = "reservas";
  // private subscriptions: Subscription
  // atual_reserva_id;
  // cards: any[];

  constructor(private modalNgb: NgbModal,
    private modalService: ModalService,
    public gerarQrCodeService: GerarQrCodeModalService,
    private reservaModalService: ReservaModalService,
    private workspaceService: WorkspaceService,
    private checkModalService: CheckModalService,
    public webService: WebService,
    // private headersService: HeadersService,
    // private domainService: DomainService,
    private http: HttpClient,
    public datatableService: DatatableService) {
      // consoleLog("douglas querido, dá uma olhada no input q passamos no ngfor. ele se chama p. para consumilio, basta fazer  ")
      // consoleLog(this.espaco)
      // consoleLog("Procurando recursos")
      // consoleLog(this.espaco)
    }

  ngOnInit() {
    // consoleLog(this.espaco)
    // this.apiUrl = `${this.domainService.getApiUrl()}/ssh/${this.espaco.id}/`;
    // this.selcionarNewEdit()
    // this.openCheckModal();
  }

  ngOnChanges() {
  }

  onAtualizarDados() {
    redirecionarQuadro({
      action: "atualizarDados",
      display: this.card.id
    });
  }

  openNewOrEdit(){
    if(this.card.situacao == 'bloqueado'){return}
    var id = this.card.atual_reserva_id
    consoleLog("Card-Espaco: Abrindo detalhe da reserva")
    if (id != undefined && id > 0){
      this.reservaModalService.abrirModalDetalheReserva(id)
      .subscribe(resultado=>{
        consoleLog("retornando do edit do card")
        consoleLog(resultado);
        if (resultado == true){
          this.refreshQuadro.emit('');
        }
      });
    }else{
      this.openModalNew(id);
    }
  }

  openModalNew(rowId?: string) {
    if(this.card.tipo_espaco != 'sala' || this.card.tipo_espaco == 'sala' 
      && this.workspaceService.autorizar('reserva_evento_criar_meu', 'reserva_evento_criar_grupo', 'reserva_evento_criar_unidade',
      'reserva_estacao_flexivel_criar_meu', 'reserva_estacao_flexivel_criar_grupo', 'reserva_estacao_flexivel_criar_unidade',
      'reserva_posto_de_trabalho_criar_meu', 'reserva_posto_de_trabalho_criar_grupo', 'reserva_posto_de_trabalho_criar_unidade') 
      && this.workspaceService.autorizar('reserva_evento_reservar_espaco')){
      Helpers.setLoading(true);
      let tela = "";
      let tipoModal = "";
    
      consoleLog(this.card);
      if (this.card.tipo_espaco == 'sala'){
        tela = "quadro_espaco_eventos"
        if (Helpers.isMobile() == true){
          tipoModal = 'simples';
        }else{
          tipoModal = 'eventos';
        }
      }else{
        tela = "quadro_espaco_estacoes_flexiveis";
        tipoModal = "estacoes_flexiveis"; 
      }

      let body = {
        espaco_id: this.card.id,
        tela: tela, //TODO: dinamizar tela da ultima interação. ex: qrcode_check_on.
        data: this.data,
        hr_inicio_previsto: this.horaInicio,
        hr_fim_previsto: this.horaFim,
        campo_alterado: 'filtro_quadros'
      }
    
      this.webService.get(`reservas/new`, body)
      .subscribe(
        dados => {
          this.reservaModalService
            .fabricarAssessorista(tipoModal, tela, dados)
            .subscribe(resultadoModal => {
              if (resultadoModal == true) {
                consoleLog("disparando emitt refresh quadro")
                this.refreshQuadro.emit('');
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
  }

  openModalHotdesk(rowId?: string) {
    Helpers.setLoading(true);
    var body = {
      espaco_id: this.card.id,
      tela: "quadro_espaco_estacoes_flexiveis", //TODO: dinamizar tela da ultima interação. ex: qrcode_check_on.
      data: this.data,
      hr_inicio_previsto: this.horaInicio,
      hr_fim_previsto: this.horaFim,
      campo_alterado: 'filtro_quadros'
    }
    var tipoModal = 'eventos';
    if (Helpers.isMobile() == true){
      tipoModal = 'simples';
    }
    this.webService.get(`reservas/new`, body)
    .subscribe(
      dados => {
        this.reservaModalService
          .fabricarAssessorista('estacoes_flexiveis', 'quadro_espaco_estacoes_flexiveis', dados)
          .subscribe(resultadoModal => {
            if (resultadoModal == true) {
              consoleLog("disparando emitt refresh quadro")
              this.refreshQuadro.emit('');
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

  openModalPostoTrabalho(rowId?: string) {
    consoleLog(rowId)
    Helpers.setLoading(true);
    var body = {
      espaco_id: this.card.id,
      tela: "quadro_espaco_postos_de_trabalho",
      data: this.data,
      hr_inicio_previsto: this.horaInicio,
      hr_fim_previsto: this.horaFim,
      campo_alterado: 'filtro_quadros'
    }
    consoleLog(body.espaco_id)
    this.webService.get(`reservas/new`, body)
    .subscribe(
      dados => {

        consoleLog("dados")
        consoleLog(dados)

        this.reservaModalService
          .fabricarAssessorista('postos_de_trabalho', 'quadro_espaco_postos_de_trabalho', dados)
          .subscribe(resultadoModal => {
            if (resultadoModal == true) {
              this.refreshQuadro.emit('');
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

  openModalInstalacao(rowId?: string) {
    Helpers.setLoading(true);
    var body = {
      espaco_id: this.card.id,
      tela: "quadro_espaco_instalacoes",
      data: this.data,
      hr_inicio_previsto: this.horaInicio,
      hr_fim_previsto: this.horaFim,
      campo_alterado: 'filtro_quadros'
    }
    this.webService.get(`reservas/new`, body)
    .subscribe(
      dados => {
        this.reservaModalService
          .fabricarAssessorista('instalacoes', 'quadro_espaco_instalacoes', dados)
          .subscribe(resultadoModal => {
            if (resultadoModal == true) {
              this.refreshQuadro.emit('');
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

  openCheckModal(espaco_id){
    consoleLog("Entrou na openCheckModal")
    consoleLog(espaco_id)
    this.checkModalService.fabricarModalCheckEspaco(espaco_id)
      .subscribe((resultadoModal)=>{
        if (resultadoModal){
            this.refreshQuadro.emit('');
        }
      })
  }

  openModalEditarEspaco(id) {
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false
    }
    // consoleLog(id)
    this.modalRecursos = this.modalNgb.open(EspacoFormComponent, ngbModalOptions);
    this.modalRecursos.componentInstance.rowId = id;
    return this.modalRecursos.result;
  }

  openModalAgendaDoDia(){
    if(this.card.situacao == 'bloqueado'){return}
    this.reservaModalService.abrirModalAgendaDoDia('espaco', this.card.id, this.card.nome, this.data)
      .subscribe((resultadoModal)=>{
        consoleLog("retornando do service.abrirmodalAgendadoDia")
        consoleLog(resultadoModal);
        if (resultadoModal){
          consoleLog("chamdno pra refresh na quadrp")
          this.refreshQuadro.emit('');
        }
      })
  }

  // openModalCheck(rowId?: string) {
  //   Helpers.setLoading(true);
  //   var body = {
  //     espaco_id: this.espaco.id,
  //     tela: "quadro_espaco",
  //     data: this.data
  //   }
  //     this.reservaModalService
  //       .fabricarAssessorista('checkin', 'quadro_espaco', {})
  //       .subscribe(resultadoModal => {
  //         if (resultadoModal == true) {
  //           this.refreshQuadro.emit('');
  //         }
  //       })
  // }

  // openModalNewInstalacao(rowId?: string) {
  //   Helpers.setLoading(true);
  //   var body = {
  //     espaco_id: this.espaco.id,
  //     tela: "quadro_espaco",
  //     data: this.data
  //   }
  //   this.webService.get(`reservas/new`, body)
  //   .subscribe(
  //     dados => {
  //       this.reservaModalService
  //         .fabricarAssessorista('instalacao', 'quadro_espaco', dados)
  //         .subscribe(resultadoModal => {
  //           if (resultadoModal == true) {
  //             this.refreshQuadro.emit('');
  //           }
  //         })
  //       Helpers.setLoading(false)
  //     },
  //     (error: any) => {
  //       this.modalService.tratarError(error)
  //       Helpers.setLoading(false);
  //     }
  //   )
  // }

  cancelarReserva(id){
    this.reservaModalService.tratarCancelamentoReserva(id).then(
      respostaModal => {
        if (respostaModal == true) {  
          this.refreshQuadro.emit('');
        }
      }
    );
  }

  abrirQrCode(id, titulo){
    consoleLog("id na card");
    consoleLog(id);
    this.gerarQrCodeService.tratarQrCode(`espaco_id=${id}`, titulo);
  }

  // selcionarNewEdit() {
  //   consoleLog("Entrou no selcionarNewEdit") 
  //   this.webService.put(`espacos/cards_reserva`, body)
  //      .subscribe(
  //        dados => {
  //         this.cards = dados.body.cards
  //         consoleLog("Como está vindo o dados do quadro")
  //         consoleLog(dados)
  //         consoleLog("Como está vindo o dados.cards do quadro")
  //         consoleLog(this.cards)
  //         this.atual_reserva_id = dados.body.cards.espacos.atual_reserva_id
  //         consoleLog("Como está vindo o 'atual_reserva_id' do quadro")
  //         consoleLog(this.atual_reserva_id)
  //         Helpers.setLoading(false)
  //        },
  //        (error: any) => {
  //          this.modalService.tratarError(error)
  //          Helpers.setLoading(false);
  //        }
  //      )
  // }

  // cancelarReserva(rowId?: string) {
  //   Helpers.setLoading(true);
  //   consoleLog("Entrou no cancelarReserva()");
  //   consoleLog("rowId");
  //   consoleLog(rowId);
  //   this.datatableService.remove(rowId);
  //   Helpers.setLoading(false);
  // }

  // criarReserva() {
  //   Helpers.setLoading(true);
  //   consoleLog("Entrou no criarReserva()");
  //   var body = {
  //     data: this.formularioReserva.get('data').value,
  //     unidade: 2
  //   }
  //   consoleLog(body);
  //   this.webService.get(`reservas/new`, body)
  //      .subscribe(
  //        dados => {
  //         // this.cards = dados.body.cards          
  //         Helpers.setLoading(false)
  //        },
  //        (error: any) => {
  //          this.modalService.tratarError(error)
  //          Helpers.setLoading(false);
  //        }
  //      )
  // }

  abrirDropdownAcoes(t){
    consoleLog("abrirDorpdown")
    this.flagSegurarDropdownAcoes = true;
    t.open();
    setTimeout(() => {
      consoleLog("timeout do abrir. flag segurar = " + this.flagSegurarDropdownAcoes)
      if (this.flagSegurarDropdownAcoes == false){
        consoleLog("abrirDorpdown.close")
        t.close();
      }
    }, 1000) 
  }

  fecharDropdownAcoes(t){
    consoleLog("fecharDropdown")
    this.flagSegurarDropdownAcoes = false;
    setTimeout(() => {
      //tratamento de tooltip pra retomada não travar.
      consoleLog("timeout do fechar. flag segurar = " + this.flagSegurarDropdownAcoes)
      if (this.flagSegurarDropdownAcoes == false){
        consoleLog("fecharDropdown.close")
        t.close();
        this.flagSegurarDropdownAcoes = false;
      }
    }, 750)
  }

  segurarDropdownAcoes(){
    consoleLog("segurarDropdown")
    this.flagSegurarDropdownAcoes = true;
  }

  abrirDropdownRecursos(t){
    consoleLog("abrirDorpdown")
    this.flagSegurarDropdownRecursos = true;
    t.open();
    setTimeout(() => {
      consoleLog("timeout do abrir. flag segurar = " + this.flagSegurarDropdownRecursos)
      if (this.flagSegurarDropdownRecursos == false){
        consoleLog("abrirDorpdown.close")
        t.close();
      }
    }, 1000) 
  }

  fecharDropdownRecursos(t){
    consoleLog("fecharDropdown")
    this.flagSegurarDropdownRecursos = false;
    setTimeout(() => {
      //tratamento de tooltip pra retomada não travar.
      consoleLog("timeout do fechar. flag segurar = " + this.flagSegurarDropdownRecursos)
      if (this.flagSegurarDropdownRecursos == false){
        consoleLog("fecharDropdown.close")
        t.close();
        this.flagSegurarDropdownRecursos = false;
      }
    }, 750)
  }

  segurarDropdownRecursos(){
    consoleLog("segurarDropdown")
    this.flagSegurarDropdownRecursos = true;
  }

  propagarRefreshQuadro(){
    this.refreshQuadro.emit('');
  }

}