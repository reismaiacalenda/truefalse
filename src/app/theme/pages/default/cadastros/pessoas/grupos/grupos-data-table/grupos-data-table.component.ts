import { Component } from '@angular/core';
import { GruposFormComponent } from '../grupos-form/grupos-form.component';
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

@Component({
  selector: 'grupos-data-table',
  templateUrl:'grupos-data-table.component.html'
})
export class GruposDataTableComponent extends TfDatatableBase {
  entidade= "grupos";
  contentFormModal = GruposFormComponent;

  constructor(public datatableService: DatatableService,
    public modalNgb: NgbModal,
    public webService: WebService,
    public modalService: ModalService,
    public workspaceService: WorkspaceService,
    public gerarQrCodeService: GerarQrCodeModalService,
    public route: ActivatedRoute,
    public reservaModalService: ReservaModalService,
    public loadingService: LoadingService,
    public checkModalService: CheckModalService){
    super(datatableService, modalNgb, webService, modalService, workspaceService, gerarQrCodeService, route, loadingService);
  }

  convidarPessoas() {
  // consoleLog("Entrou no convidarPessoas");
    this.reservaModalService.abrirModalConvidarPessoas()
  }

}