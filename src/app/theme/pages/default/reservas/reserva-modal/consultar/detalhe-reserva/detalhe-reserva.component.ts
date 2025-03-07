// import { Validators, FormGroup } from '@angular/forms';
import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
import { FormArray, FormControl, FormBuilder } from '@angular/forms';
import { ReservaModalService } from '../../reserva-modal.service';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Helpers } from '../../../../../../../helpers';
import { consoleLog } from '../../../../../../../globals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WebService } from '../../../../../../../_services/web.service';
import { ModalService } from '../../../../modal/modal.service';
import { FormService } from '../../../../../../../_services/form.service';
import { HttpClient } from '@angular/common/http';
import { DomainService } from '../../../../../../../_services/domain.service';
import { WorkspaceService } from '../../../../../../../_services/workspace.service';
import { HeadersService } from '../../../../../../../_services/header.service';
import { LoadingService } from '../../../../../../../_services/loading.service';
import { User } from '../../../../../../../auth/_models/user';




@Component({
  selector: 'detalhe-reserva',
  templateUrl: 'detalhe-reserva.component.html'
})
export class DetalheReservaComponent implements OnInit, AfterViewInit {
  reserva:any;
  id;
  currentUser: User;
  public formService: FormService;

  constructor(public activeModal: NgbActiveModal,
  public reservaModalService:ReservaModalService,
  public webService:WebService,
  public modalService:ModalService,
  public workspaceService:WorkspaceService,
  protected http: HttpClient,
  private domainService: DomainService,
  private headersService: HeadersService,
  private loadingService: LoadingService,
  public formBuilder: FormBuilder){
    this.currentUser = this.workspaceService.currentUser;
    this.formService = new FormService(this.http,this.domainService,this.modalService,this.formBuilder,this.headersService, this.loadingService)
  }

  ngOnInit(){
    this.formService.inicializar(
      "reservas",
      this.reservaModalService.formulario,
      this.activeModal,
      {}
    );
  }
  
  ngAfterViewInit(){
    Helpers.setLoading(false);
  }
  
  onSubmit() {
    // consoleLog(this.formulario);
    // this.activeModal.close(this.formulario);
  }

  openFormModalEdit() {
    consoleLog("open form modal edit");
    Helpers.setLoading(true);
    this.webService.get(`reservas/${this.id}/edit`)
    .subscribe(
      dados => {
      consoleLog(dados);
        this.reservaModalService.fabricarAssessorista(dados.tipo_reserva, dados.tela, dados)
        .subscribe(resultadoModal=>{
          if (resultadoModal == true){
            // this.refreshTable();
          }
          consoleLog("retorno de fabricar assestorista pra abrir modal edit. resultado:")
          consoleLog(resultadoModal)
          this.activeModal.close(resultadoModal);
        });
        Helpers.setLoading(false)
      },
      (error: any) => {
        this.activeModal.close(false);
        this.modalService.tratarError(error)
        Helpers.setLoading(false);
      }
    )
  }

  cancelarReserva(lote){
    // this.activeModal.close(false);
    if(lote) {
      this.formService.remove(this.id, true)
    } else {
      this.reservaModalService.tratarCancelamentoReserva(this.id).then(
        respostaModal => {
          if (respostaModal == true) {  
            // this.refreshTable();
            this.activeModal.close(true);
          }
        }
      );      
    }
  }

}