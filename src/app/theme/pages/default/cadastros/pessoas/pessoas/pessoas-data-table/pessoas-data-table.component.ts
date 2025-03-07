import { Component, ViewChild, OnInit } from '@angular/core';
import {PessoaFormComponent} from '../pessoas-form/pessoas-form.component';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';
import { DatatableService } from '../../../../../../../_services/datatable.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebService } from '../../../../../../../_services/web.service';
import { ModalService } from '../../../../modal/modal.service';
import { WorkspaceService } from '../../../../../../../_services/workspace.service';
import { GerarQrCodeModalService } from '../../../../gerar-qrcode/gerar-qrcode.service';
import { ActivatedRoute } from '@angular/router';
import { ReservaModalService } from '../../../../reservas/reserva-modal/reserva-modal.service';
import { CheckModalService } from '../../../../reservas/checks-modal/check-modal.service';
import { LoadingService } from '../../../../../../../_services/loading.service';
import { Helpers } from '../../../../../../../helpers';

@Component({
  selector: 'pessoas-data-table',
  templateUrl: './pessoas-data-table.component.html'
})
export class PessoaDataTableComponent extends TfDatatableBase {
  entidade = "funcionarios";
  contentFormModal = PessoaFormComponent;
  public convidado: boolean = false;

  constructor(public datatableService: DatatableService,
    public modalNgb: NgbModal,
    public webService: WebService,
    public modalService: ModalService,
    public workspaceService: WorkspaceService,
    public gerarQrCodeService: GerarQrCodeModalService,
    public route: ActivatedRoute,
    public reservaModalService: ReservaModalService,
    public checkModalService: CheckModalService,
    public loadingService: LoadingService){
    super(datatableService, modalNgb, webService, modalService, workspaceService, gerarQrCodeService, route, loadingService);

  }

  convidarPessoas() {
  // consoleLog("Entrou no convidarPessoas");
    this.reservaModalService.abrirModalConvidarPessoas()
  }

  reenviarConvite(id){
    Helpers.setLoading(true);
    this.webService.put(`funcionarios/${id}/reenviar_convite`, {})
      .subscribe(
        response =>{
          this.modalService.tratarMensagem("Reenvio de convite", response.body.message)
          Helpers.setLoading(false);
        },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
  }

  ativarUsuario(id){
    Helpers.setLoading(true);
    this.webService.put(`funcionarios/${id}/ativar_usuario`, {})
      .subscribe(
        response =>{
          this.modalService.tratarMensagem("Ativação Usuário", response.body.message);
          this.carregarTable();
          Helpers.setLoading(false);
        },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
  }

  desativarUsuario(id){
    Helpers.setLoading(true);
    this.webService.put(`funcionarios/${id}/desativar_usuario`, {})
      .subscribe(
        response =>{
          this.modalService.tratarMensagem("Desativação Usuário", response.body.message);
          this.carregarTable();
          Helpers.setLoading(false);
        },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
  }

  reenviarConviteEmMassa(){
    Helpers.setLoading(true);
    this.webService.put(`funcionarios/reenviar_convite_em_massa`, {})
      .subscribe(
        response =>{
          this.modalService.tratarMensagem(response.body.title, response.body.message)
          Helpers.setLoading(false);
        },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
  }
}