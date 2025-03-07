import { Component } from '@angular/core';
import { AprovadoresFormComponent } from '../aprovadores-form/aprovadores-form.component';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';
import { Helpers } from '../../../../../../../helpers';
import { ReservaModalService } from '../../../../reservas/reserva-modal/reserva-modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableService } from '../../../../../../../_services/datatable.service';
import { WebService } from '../../../../../../../_services/web.service';
import { ModalService } from '../../../../modal/modal.service';
import { WorkspaceService } from '../../../../../../../_services/workspace.service';
import { GerarQrCodeModalService } from '../../../../gerar-qrcode/gerar-qrcode.service';
import { ActivatedRoute } from '@angular/router';
import { CheckModalService } from '../../../../reservas/checks-modal/check-modal.service';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../../../../../../_services/loading.service';



@Component({
  selector: 'aprovadores-data-table',
  templateUrl:'aprovadores-data-table.component.html'
})
export class AprovadoresDataTableComponent extends TfDatatableBase {
  entidade= "aprovadores";
  contentFormModal = AprovadoresFormComponent;
  
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

}