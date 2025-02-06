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

declare function redirecionarQuadro(data): any;

@Component({
  moduleId: module.id,
  templateUrl: "./collapse-bar.component.html",
  selector: "collapse-bar",
})

export class CollapseBarComponent implements OnInit, OnChanges {
  @Input() espaco: any;
  @Input() grupo: any;
  @Input() data: any;
  @Output() refreshPessoa = new EventEmitter();
  public activeModal: NgbActiveModal;
  public modalRecursos: NgbModalRef;
  flagSegurarDropdown: boolean = false;
  expandido: boolean = true;
  // apiUrl: string;
  // entidade_url = "reservas";
  // private subscriptions: Subscription
  // atual_reserva_id;
  // cards: any[];

  constructor(private modalNgb: NgbModal,
    private modalService: ModalService,
    public gerarQrCodeService: GerarQrCodeModalService,
    private reservaModalService: ReservaModalService,
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

  }

  ngOnChanges() {
  }

  alteracaoCollapse(event){
    this.expandido = !this.expandido;
    Helpers.setLoading(false);
  }

  onAtualizarDados() {
    redirecionarQuadro({
      action: "atualizarDados",
      display: this.espaco.id
    });
  }

  abrirDropdown(t){
    t.open();
    setTimeout(() => {
      if (this.flagSegurarDropdown == false){
        t.close();
      }
    }, 1000) 
  }

  fecharDropdown(t){
    t.close();
    this.flagSegurarDropdown = false;
  }

  segurarDropdown(){
    this.flagSegurarDropdown = true;
  }

  propagarRefreshPessoa(){
    this.refreshPessoa.emit('');
  }

}