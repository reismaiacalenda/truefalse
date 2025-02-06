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
// import { RecursosAlocadosDataTableComponent } from '../../../recursos-alocados/recursos-alocados-data-table/recursos-alocados-data-table.component';
import { RecursoFormComponent } from '../../../../cadastros/recursos/recursos/recurso-form/recurso-form.component';
import { WorkspaceService } from '../../../../../../../_services/workspace.service';
import { PessoaFormComponent } from '../../../../cadastros/pessoas/pessoas/pessoas-form/pessoas-form.component';

declare function redirecionarPessoa(data): any;

@Component({
  moduleId: module.id,
  templateUrl: "./card.component.html",
  selector: "card",
})

export class CardComponent implements OnInit, OnChanges {
  @Input() pessoa: any;
  // @Input() localizacao: any;
  @Input() data: any;
  @Output() refreshPessoa = new EventEmitter();
  // public activeModal: NgbActiveModal;
  // apiUrl: string;
  // entidade_url = "reservas";
  // private subscriptions: Subscription
  // atual_reserva_id;
  // servicos: any[];
  modalPessoas: NgbModalRef;
  flagSegurarDropdown: boolean = false;
  
  constructor(private modalNgb: NgbModal,
    private modalService: ModalService,
    public gerarQrCodeService: GerarQrCodeModalService,
    private reservaModalService: ReservaModalService,
    private checkModalService: CheckModalService,
    public webService: WebService,
    public workspaceService: WorkspaceService,
    // public ngbModalRef: NgbModalRef,
    // private headersService: HeadersService,
    // private domainService: DomainService,
    private http: HttpClient,
    public datatableService: DatatableService) {
      // consoleLog("douglas querido, dá uma olhada no input q passamos no ngfor. ele se chama p. para consumilio, basta fazer  ")
      // consoleLog(this.pessoa)
      // consoleLog("Procurando pessoas")
      // consoleLog(this.pessoa)
    }

  ngOnInit() {
    // consoleLog(this.pessoa)
    // this.apiUrl = `${this.domainService.getApiUrl()}/ssh/${this.pessoa.id}/`;
    // this.selcionarNewEdit()
    // this.openCheckModal();
  }

  ngOnChanges() {
  }

  onAtualizarDados() {
    redirecionarPessoa({
      action: "atualizarDados",
      display: this.pessoa.id
    });
  }

  openModalAgendaDoDia(){
    this.reservaModalService.abrirModalAgendaDoDia('funcionario', this.pessoa.id, this.pessoa.nome, this.data)
      .subscribe((resultadoModal)=>{
        if (resultadoModal){
            this.refreshPessoa.emit('');
        }
      })
  }

  openModalNew(rowId?: string) {
    Helpers.setLoading(true);
    var body = {
      pessoa_id: this.pessoa.id,
      tela: "quadro_pessoa_eventos", //TODO: dinamizar tela da ultima interação. ex: qrcode_check_on.
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
          .fabricarAssessorista(tipoModal, 'quadro_pessoa_eventos', dados)
          .subscribe(resultadoModal => {
            if (resultadoModal == true) {
              this.refreshPessoa.emit('');
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

  openModalPostoTrabalho() {
    Helpers.setLoading(true);
    var body = {
      pessoa_id: this.pessoa.id,
      tela: "quadro_pessoa_postos_de_trabalho",
      data: this.data
    }
    this.webService.get(`reservas/new`, body)
    .subscribe(
      dados => {

      // consoleLog("dados")
      // consoleLog(dados)

        this.reservaModalService
          .fabricarAssessorista('postos_de_trabalho', 'quadro_pessoa_postos_de_trabalho', dados)
          .subscribe(resultadoModal => {
            if (resultadoModal == true) {
              this.refreshPessoa.emit('');
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

  openModalHotDesk() {
    Helpers.setLoading(true);
    var body = {
      pessoa_id: this.pessoa.id,
      tela: "quadro_pessoa_estacoes_flexiveis",
      data: this.data
    }
    this.webService.get(`reservas/new`, body)
    .subscribe(
      dados => {

      // consoleLog("dados")
      // consoleLog(dados)

        this.reservaModalService
          .fabricarAssessorista('estacoes_flexiveis', 'quadro_pessoa_estacoes_flexiveis', dados)
          .subscribe(resultadoModal => {
            if (resultadoModal == true) {
              this.refreshPessoa.emit('');
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

  openModalEquipagem() {
    Helpers.setLoading(true);
    var body = {
      pessoa_id: this.pessoa.id,
      tela: "quadro_pessoa_equipagens",
      data: this.data
    }
    this.webService.get(`reservas/new`, body)
    .subscribe(
      dados => {
        this.reservaModalService
          .fabricarAssessorista('equipagens', 'quadro_pessoa_equipagens', dados)
          .subscribe(resultadoModal => {
            if (resultadoModal == true) {
              this.refreshPessoa.emit('');
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

  openModalEmprestimo() {
    Helpers.setLoading(true);
    var body = {
      pessoa_id: this.pessoa.id,
      tela: "quadro_pessoa_emprestimos",
      data: this.data
    }
    this.webService.get(`reservas/new`, body)
    .subscribe(
      dados => {
        this.reservaModalService
          .fabricarAssessorista('emprestimos', 'quadro_pessoa_emprestimos', dados)
          .subscribe(resultadoModal => {
            if (resultadoModal == true) {
              this.refreshPessoa.emit('');
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

  openModalEditarPessoa(id) {
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false
    }
    // consoleLog(id)
    this.modalPessoas = this.modalNgb.open(PessoaFormComponent, ngbModalOptions);
    this.modalPessoas.componentInstance.rowId = id;
    return this.modalPessoas.result;
  }

  abrirQrCode(id, titulo){
  // consoleLog("id na card");
  // consoleLog(id);
    this.gerarQrCodeService.tratarQrCode(`pessoa_id=${id}`, titulo);
  }

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