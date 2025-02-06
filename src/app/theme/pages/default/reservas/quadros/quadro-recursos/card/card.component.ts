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
import { consoleLog } from '../../../../../../../globals';
import { CheckModalService } from '../../../checks-modal/check-modal.service';
import { GerarQrCodeModalService } from '../../../../gerar-qrcode/gerar-qrcode.service';
import { RecursoFormComponent } from '../../../../cadastros/recursos/recursos/recurso-form/recurso-form.component';
import { RecursosAlocadosDataTableComponent } from '../../../recursos-alocados/recursos-alocados-data-table/recursos-alocados-data-table.component';
import { WorkspaceService } from '../../../../../../../_services/workspace.service';

declare function redirecionarRecurso(data): any;

@Component({
  moduleId: module.id,
  templateUrl: "./card.component.html",
  selector: "card",
})

export class CardComponent implements OnInit, OnChanges {
  @Input() recurso: any;
  // @Input() localizacao: any;
  @Input() data: any;
  @Output() refreshRecurso = new EventEmitter();
  // public activeModal: NgbActiveModal;
  // apiUrl: string;
  // entidade_url = "reservas";
  // private subscriptions: Subscription
  // atual_reserva_id;
  // servicos: any[];
  modalRecursos: NgbModalRef;
  flagSegurarDropdown: boolean = false;
  
  constructor(private modalNgb: NgbModal,
    private modalService: ModalService,
    public gerarQrCodeService: GerarQrCodeModalService,
    private reservaModalService: ReservaModalService,
    private checkModalService: CheckModalService,
    public webService: WebService,
    // public ngbModalRef: NgbModalRef,
    // private headersService: HeadersService,
    // private domainService: DomainService,
    private http: HttpClient,
    public datatableService: DatatableService,
    public workspaceService: WorkspaceService) {
      // consoleLog("douglas querido, dá uma olhada no input q passamos no ngfor. ele se chama p. para consumilio, basta fazer  ")
      // consoleLog(this.recurso)
      // consoleLog("Procurando recursos")
      // consoleLog(this.recurso)
    }

  ngOnInit() {
    // consoleLog(this.recurso)
    // this.apiUrl = `${this.domainService.getApiUrl()}/ssh/${this.recurso.id}/`;
    // this.selcionarNewEdit()
    // this.openCheckModal();
  }

  ngOnChanges() {
  }

  onAtualizarDados() {
    redirecionarRecurso({
      action: "atualizarDados",
      display: this.recurso.id
    });
  }

  openModalAgendaDoDia(){
    this.reservaModalService.abrirModalAgendaDoDia('recurso', this.recurso.id, this.recurso.nome, this.data)
      .subscribe((resultadoModal)=>{
        if (resultadoModal){
            this.refreshRecurso.emit('');
        }
      })
  }

  openModalNew(rowId?: string) {
    if(this.workspaceService.autorizar('reserva_evento_criar_meu', 'reserva_evento_criar_grupo', 'reserva_evento_criar_unidade') 
      && this.workspaceService.autorizar('reserva_evento_reservar_espaco')){
      Helpers.setLoading(true);
      var body = {
        recurso_id: this.recurso.id,
        tela: "quadro_recurso_eventos", //TODO: dinamizar tela da ultima interação. ex: qrcode_check_on.
        data: this.data
      }
      var tipoModal = 'eventos';
      if (Helpers.isMobile() == true){
        tipoModal = 'simples';
      }
      this.webService.get(`reservas/new`, body)
      .subscribe(
        dados => {
          this.reservaModalService
            .fabricarAssessorista(tipoModal, 'quadro_recurso_eventos', dados)
            .subscribe(resultadoModal => {
              if (resultadoModal == true) {
                this.refreshRecurso.emit('');
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

  openKitEstande(rowId?: string) {
    Helpers.setLoading(true);
    var body = {
      recurso_id: this.recurso.id,
      tela: "quadro_recurso_kit_estandes",
      data: this.data
    }
    this.webService.get(`reservas/new`, body)
    .subscribe(
      dados => {
        this.reservaModalService
          .fabricarAssessorista('kit_estandes', 'quadro_recurso_kit_estandes', dados)
          .subscribe(resultadoModal => {
            if (resultadoModal == true) {
              this.refreshRecurso.emit('');
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
      recurso_id: this.recurso.id,
      tela: "quadro_recurso_instalacoes",
      data: this.data
    }
    this.webService.get(`reservas/new`, body)
    .subscribe(
      dados => {
        this.reservaModalService
          .fabricarAssessorista('instalacoes', 'quadro_recurso_instalacoes', dados)
          .subscribe(resultadoModal => {
            if (resultadoModal == true) {
              this.refreshRecurso.emit('');
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

  openModalEquipagem(rowId?: string) {
  // consoleLog(rowId)
    Helpers.setLoading(true);
    var body = {
      recurso_id: this.recurso.id,
      tela: "quadro_recurso_equipagens",
      data: this.data
    }
  // consoleLog(body.recurso_id)
    this.webService.get(`reservas/new`, body)
    .subscribe(
      dados => {
        this.reservaModalService
          .fabricarAssessorista('equipagens', 'quadro_recurso_equipagens', dados)
          .subscribe(resultadoModal => {
            if (resultadoModal == true) {
              this.refreshRecurso.emit('');
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

  openModalEmprestimo(rowId?: string) {
  // consoleLog(rowId)
    Helpers.setLoading(true);
    var body = {
      recurso_id: this.recurso.id,
      tela: "quadro_recurso_emprestimos",
      data: this.data
    }
  // consoleLog(body.recurso_id)
    this.webService.get(`reservas/new`, body)
    .subscribe(
      dados => {
        this.reservaModalService
          .fabricarAssessorista('emprestimos', 'quadro_recurso_emprestimos', dados)
          .subscribe(resultadoModal => {
            if (resultadoModal == true) {
              this.refreshRecurso.emit('');
            }
          })
        Helpers.setLoading(false)
      },
      (error: any) => {
        // consoleLog(error)
        this.modalService.tratarError(error)
        Helpers.setLoading(false);
      }
    )
  }

  openModalEditarRecurso(id) {
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false
    }
    // consoleLog(id)
    this.modalRecursos = this.modalNgb.open(RecursoFormComponent, ngbModalOptions);
    this.modalRecursos.componentInstance.rowId = id;
    return this.modalRecursos.result;
  }

  // openCheckModal(recurso_id){
  // // consoleLog("Entrou na openCheckModal")
  // // consoleLog(recurso_id)
  //   this.checkModalService.fabricarModalCheckEspaco(recurso_id)
  //     .subscribe((resultadoModal)=>{
  //       if (resultadoModal){
  //           this.refreshRecurso.emit('');
  //       }
  //     })
  // }

  // openModalCheck(rowId?: string) {
  //   Helpers.setLoading(true);
  //   var body = {
  //     recurso_id: this.recurso.id,
  //     tela: "quadro_recurso",
  //     data: this.data
  //   }
  //     this.reservaModalService
  //       .fabricarAssessorista('checkin', 'quadro_recurso', {})
  //       .subscribe(resultadoModal => {
  //         if (resultadoModal == true) {
  //           this.refreshRecurso.emit('');
  //         }
  //       })
  // }

  // openModalNewInstalacao(rowId?: string) {
  //   Helpers.setLoading(true);
  //   var body = {
  //     recurso_id: this.recurso.id,
  //     tela: "quadro_recurso",
  //     data: this.data
  //   }
  //   this.webService.get(`reservas/new`, body)
  //   .subscribe(
  //     dados => {
  //       this.reservaModalService
  //         .fabricarAssessorista('instalacao', 'quadro_recurso', dados)
  //         .subscribe(resultadoModal => {
  //           if (resultadoModal == true) {
  //             this.refreshRecurso.emit('');
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

  // cancelarReserva(id){
  //   this.modalService.tratarExclusao().then(
  //     respostaModal => {
  //       if (respostaModal) {
  //         Helpers.setLoading(true);
  //          this.webService.delete(`reservas`, id)
  //           .subscribe(
  //             (response) => {
  //               this.modalService.tratarSucesso(response);
  //             // consoleLog("na hora de tratar o o remove dentro de form.service. como tá o response/?")
  //             // consoleLog(response)
  //               if (response.status > 199 && response.status < 300) {
  //                 this.refreshRecurso.emit('');
  //                 // this.activeModal.close(false);
  //               }
  //             },
  //             (error: any) => this.modalService.tratarError(error))
  //           .add(()=>Helpers.setLoading(false));
  //       }
  //     }
  //   );
  // }

  abrirQrCode(id, titulo){
  // consoleLog("id na card");
  // consoleLog(id);
    this.gerarQrCodeService.tratarQrCode(`recurso_id=${id}`, titulo);
  }

  // selcionarNewEdit() {
  // // consoleLog("Entrou no selcionarNewEdit") 
  //   this.webService.put(`recursos/servicos_reserva`, body)
  //      .subscribe(
  //        dados => {
  //         this.servicos = dados.body.servicos
  //       // consoleLog("Como está vindo o dados do recurso")
  //       // consoleLog(dados)
  //       // consoleLog("Como está vindo o dados.servicos do recurso")
  //       // consoleLog(this.servicos)
  //         this.atual_reserva_id = dados.body.servicos.recursos.atual_reserva_id
  //       // consoleLog("Como está vindo o 'atual_reserva_id' do recurso")
  //       // consoleLog(this.atual_reserva_id)
  //         Helpers.setLoading(false)
  //        },
  //        (error: any) => {
  //          this.modalService.tratarError(error)
  //          Helpers.setLoading(false);
  //        }
  //      )
  // }

  //  cancelarReserva(id) {
  //     Helpers.setLoading(true);
  //   // consoleLog("Entrou no cancelarReserva()");
  //   // consoleLog("Id");
  //   // consoleLog(id);
  //     this.webService.delete(`reservas`, id)
  //     Helpers.setLoading(false);
  //   }

  // cancelarReserva(rowId?: string) {
  //   Helpers.setLoading(true);
  // // consoleLog("Entrou no cancelarReserva()");
  // // consoleLog("rowId");
  // // consoleLog(rowId);
  //   this.datatableService.remove(rowId);
  //   Helpers.setLoading(false);
  // }

  // criarReserva() {
  //   Helpers.setLoading(true);
  // // consoleLog("Entrou no criarReserva()");
  //   var body = {
  //     data: this.formularioReserva.get('data').value,
  //     unidade: 2
  //   }
  // // consoleLog(body);
  //   this.webService.get(`reservas/new`, body)
  //      .subscribe(
  //        dados => {
  //         // this.servicos = dados.body.servicos          
  //         Helpers.setLoading(false)
  //        },
  //        (error: any) => {
  //          this.modalService.tratarError(error)
  //          Helpers.setLoading(false);
  //        }
  //      )
  // }

  abrirDropdown(t){
    consoleLog("abrirDorpdown")
    this.flagSegurarDropdown = true;
    t.open();
    setTimeout(() => {
      consoleLog("timeout do abrir. flag segurar = " + this.flagSegurarDropdown)
      if (this.flagSegurarDropdown == false){
        consoleLog("abrirDorpdown.close")
        t.close();
      }
    }, 1000) 
  }

  fecharDropdown(t){
    consoleLog("fecharDropdown")
    this.flagSegurarDropdown = false;
    setTimeout(() => {
      //tratamento de tooltip pra retomada não travar.
      consoleLog("timeout do fechar. flag segurar = " + this.flagSegurarDropdown)
      if (this.flagSegurarDropdown == false){
        consoleLog("fecharDropdown.close")
        t.close();
        this.flagSegurarDropdown = false;
      }
    }, 750)
  }

  segurarDropdown(){
    this.flagSegurarDropdown = true;
  }

}