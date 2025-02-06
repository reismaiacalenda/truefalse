import { Component, ViewChild, OnInit } from '@angular/core';
import { TfDatatableBase } from '../../../../../../_andaime/tf-datatable/tf-datatable-base';
import { DatatableService } from '../../../../../../_services/datatable.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../modal/modal.service';
import { WorkspaceService } from '../../../../../../_services/workspace.service';
import { WebService } from '../../../../../../_services/web.service';
import { CheckModalService } from '../../checks-modal/check-modal.service';
import { ActivatedRoute } from '@angular/router';
import { GerarQrCodeModalService } from '../../../gerar-qrcode/gerar-qrcode.service';
import { consoleLog } from '../../../../../../globals';
import { Helpers } from '../../../../../../helpers';
import { ReservaModalService } from '../../reserva-modal/reserva-modal.service';
import { LoadingService } from '../../../../../../_services/loading.service';


@Component({
  selector: 'recursos-alocados-data-table',
  templateUrl: './recursos-alocados-data-table.component.html'
})
export class RecursosAlocadosDataTableComponent extends TfDatatableBase {
  entidade = "recursos_reservas";
  contentFormModal = "";
  isMobile: boolean = Helpers.isMobile();

  constructor(public datatableService: DatatableService,
    public modalNgb: NgbModal,
    public webService: WebService,
    public modalService: ModalService,
    public workspaceService: WorkspaceService,
    public gerarQrCodeService: GerarQrCodeModalService,
    public route: ActivatedRoute,
    public loadingService: LoadingService,
    public checkModalService: CheckModalService,
    private reservaModalService: ReservaModalService,

    ){
    super(datatableService, modalNgb, webService, modalService, workspaceService, gerarQrCodeService, route, loadingService);
  }  

  childInit(){
  }

  openCheckModal(recurso_reserva_id){
    // consoleLog("Entrou no openCheckModal")
    // consoleLog(recurso_reserva_id)
    this.checkModalService.fabricarModalCheckRecurso(recurso_reserva_id)
      .subscribe((resultadoModal)=>{
        if (resultadoModal){
          this.refreshTable();
        }
      },
      (error: any) => {
        this.modalService.tratarError(error)
        Helpers.setLoading(false);
      }
      )
      // this.webService.get(`checks/new?recurso_reserva_id=${recurso_reserva_id}`)
      // .subscribe(response=>{
      //   consoleLog(response);
      //   if (response['check_type'] == "in" || response['check_type']=="out" || response['check_type']=="list"){
      //     this.checkModalService.fabricarModalCheck(response)
      //     .subscribe(()=>{
      //       this.refreshTable();
      //     })
      //   }
      // })
  }

  openFormModalEdit(rowId: string) {
    consoleLog("open form modal edit");
    Helpers.setLoading(true);
    this.webService.get(`reservas/${rowId}/edit`)
    .subscribe(
      dados => {
        this.reservaModalService.fabricarAssessorista('avancada', dados.tela, dados)
        .subscribe(resultadoModal=>{
        });
        Helpers.setLoading(false)
      },
      (error: any) => {
        this.modalService.tratarError(error)
        Helpers.setLoading(false);
      }
    )
  }

}